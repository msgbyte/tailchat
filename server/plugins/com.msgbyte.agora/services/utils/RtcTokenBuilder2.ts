import { AccessToken2 as AccessToken, ServiceRtc } from './AccessToken2';

export const Role = {
  // for live broadcaster
  PUBLISHER: 1,

  // default, for live audience
  SUBSCRIBER: 2,
};

export class RtcTokenBuilder {
  /**
   * Builds an RTC token using an Integer uid.
   * @param {*} appId  The App ID issued to you by Agora.
   * @param {*} appCertificate Certificate of the application that you registered in the Agora Dashboard.
   * @param {*} channelName The unique channel name for the AgoraRTC session in the string format. The string length must be less than 64 bytes. Supported character scopes are:
   * - The 26 lowercase English letters: a to z.
   * - The 26 uppercase English letters: A to Z.
   * - The 10 digits: 0 to 9.
   * - The space.
   * - "!", "#", "$", "%", "&", "(", ")", "+", "-", ":", ";", "<", "=", ".", ">", "?", "@", "[", "]", "^", "_", " {", "}", "|", "~", ",".
   * @param {*} uid User ID. A 32-bit unsigned integer with a value ranging from 1 to (2^32-1).
   * @param {*} role See #userRole.
   * - Role.PUBLISHER; RECOMMENDED. Use this role for a voice/video call or a live broadcast.
   * - Role.SUBSCRIBER: ONLY use this role if your live-broadcast scenario requires authentication for [Hosting-in](https://docs.agora.io/en/Agora%20Platform/terms?platform=All%20Platforms#hosting-in). In order for this role to take effect, please contact our support team to enable authentication for Hosting-in for you. Otherwise, Role_Subscriber still has the same privileges as Role_Publisher.
   * @param {*} token_expire epresented by the number of seconds elapsed since now. If, for example, you want to access the Agora Service within 10 minutes after the token is generated, set token_expire as 600(seconds)
   * @param {*} privilege_expire represented by the number of seconds elapsed since now. If, for example, you want to enable your privilege for 10 minutes, set privilege_expire as 600(seconds).     * @return The new Token.
   */
  static buildTokenWithUid(
    appId,
    appCertificate,
    channelName,
    uid,
    role,
    token_expire,
    privilege_expire = 0
  ) {
    return this.buildTokenWithUserAccount(
      appId,
      appCertificate,
      channelName,
      uid,
      role,
      token_expire,
      privilege_expire
    );
  }

  /**
   * Builds an RTC token using an Integer uid.
   * @param {*} appId  The App ID issued to you by Agora.
   * @param {*} appCertificate Certificate of the application that you registered in the Agora Dashboard.
   * @param {*} channelName The unique channel name for the AgoraRTC session in the string format. The string length must be less than 64 bytes. Supported character scopes are:
   * - The 26 lowercase English letters: a to z.
   * - The 26 uppercase English letters: A to Z.
   * - The 10 digits: 0 to 9.
   * - The space.
   * - "!", "#", "$", "%", "&", "(", ")", "+", "-", ":", ";", "<", "=", ".", ">", "?", "@", "[", "]", "^", "_", " {", "}", "|", "~", ",".
   * @param {*} account The user account.
   * @param {*} role See #userRole.
   * - Role.PUBLISHER; RECOMMENDED. Use this role for a voice/video call or a live broadcast.
   * - Role.SUBSCRIBER: ONLY use this role if your live-broadcast scenario requires authentication for [Hosting-in](https://docs.agora.io/en/Agora%20Platform/terms?platform=All%20Platforms#hosting-in). In order for this role to take effect, please contact our support team to enable authentication for Hosting-in for you. Otherwise, Role_Subscriber still has the same privileges as Role_Publisher.
   * @param {*} token_expire epresented by the number of seconds elapsed since now. If, for example, you want to access the Agora Service within 10 minutes after the token is generated, set token_expire as 600(seconds)
   * @param {*} privilege_expire represented by the number of seconds elapsed since now. If, for example, you want to enable your privilege for 10 minutes, set privilege_expire as 600(seconds).
   * @return The new Token.
   */
  static buildTokenWithUserAccount(
    appId,
    appCertificate,
    channelName,
    account,
    role,
    token_expire,
    privilege_expire = 0
  ) {
    const token = new AccessToken(appId, appCertificate, 0, token_expire);

    const serviceRtc = new ServiceRtc(channelName, account);
    serviceRtc.add_privilege(
      ServiceRtc.kPrivilegeJoinChannel,
      privilege_expire
    );
    if (role == Role.PUBLISHER) {
      serviceRtc.add_privilege(
        ServiceRtc.kPrivilegePublishAudioStream,
        privilege_expire
      );
      serviceRtc.add_privilege(
        ServiceRtc.kPrivilegePublishVideoStream,
        privilege_expire
      );
      serviceRtc.add_privilege(
        ServiceRtc.kPrivilegePublishDataStream,
        privilege_expire
      );
    }
    token.add_service(serviceRtc);

    return token.build();
  }

  /**
   * Generates an RTC token with the specified privilege.
   *
   * This method supports generating a token with the following privileges:
   * - Joining an RTC channel.
   * - Publishing audio in an RTC channel.
   * - Publishing video in an RTC channel.
   * - Publishing data streams in an RTC channel.
   *
   * The privileges for publishing audio, video, and data streams in an RTC channel apply only if you have
   * enabled co-host authentication.
   *
   * A user can have multiple privileges. Each privilege is valid for a maximum of 24 hours.
   * The SDK triggers the onTokenPrivilegeWillExpire and onRequestToken callbacks when the token is about to expire
   * or has expired. The callbacks do not report the specific privilege affected, and you need to maintain
   * the respective timestamp for each privilege in your app logic. After receiving the callback, you need
   * to generate a new token, and then call renewToken to pass the new token to the SDK, or call joinChannel to re-join
   * the channel.
   *
   * @note
   * Agora recommends setting a reasonable timestamp for each privilege according to your scenario.
   * Suppose the expiration timestamp for joining the channel is set earlier than that for publishing audio.
   * When the token for joining the channel expires, the user is immediately kicked off the RTC channel
   * and cannot publish any audio stream, even though the timestamp for publishing audio has not expired.
   *
   * @param appId The App ID of your Agora project.
   * @param appCertificate The App Certificate of your Agora project.
   * @param channelName The unique channel name for the Agora RTC session in string format. The string length must be less than 64 bytes. The channel name may contain the following characters:
   * - All lowercase English letters: a to z.
   * - All uppercase English letters: A to Z.
   * - All numeric characters: 0 to 9.
   * - The space character.
   * - "!", "#", "$", "%", "&", "(", ")", "+", "-", ":", ";", "<", "=", ".", ">", "?", "@", "[", "]", "^", "_", " {", "}", "|", "~", ",".
   * @param uid The user ID. A 32-bit unsigned integer with a value range from 1 to (2^32 - 1). It must be unique. Set uid as 0, if you do not want to authenticate the user ID, that is, any uid from the app client can join the channel.
   * @param tokenExpire represented by the number of seconds elapsed since now. If, for example, you want to access the
   * Agora Service within 10 minutes after the token is generated, set token_expire as 600(seconds).
   * @param joinChannelPrivilegeExpire The Unix timestamp when the privilege for joining the channel expires, represented
   * by the sum of the current timestamp plus the valid time period of the token. For example, if you set joinChannelPrivilegeExpire as the
   * current timestamp plus 600 seconds, the token expires in 10 minutes.
   * @param pubAudioPrivilegeExpire The Unix timestamp when the privilege for publishing audio expires, represented
   * by the sum of the current timestamp plus the valid time period of the token. For example, if you set pubAudioPrivilegeExpire as the
   * current timestamp plus 600 seconds, the token expires in 10 minutes. If you do not want to enable this privilege,
   * set pubAudioPrivilegeExpire as the current Unix timestamp.
   * @param pubVideoPrivilegeExpire The Unix timestamp when the privilege for publishing video expires, represented
   * by the sum of the current timestamp plus the valid time period of the token. For example, if you set pubVideoPrivilegeExpire as the
   * current timestamp plus 600 seconds, the token expires in 10 minutes. If you do not want to enable this privilege,
   * set pubVideoPrivilegeExpire as the current Unix timestamp.
   * @param pubDataStreamPrivilegeExpire The Unix timestamp when the privilege for publishing data streams expires, represented
   * by the sum of the current timestamp plus the valid time period of the token. For example, if you set pubDataStreamPrivilegeExpire as the
   * current timestamp plus 600 seconds, the token expires in 10 minutes. If you do not want to enable this privilege,
   * set pubDataStreamPrivilegeExpire as the current Unix timestamp.
   * @return The new Token
   */
  static buildTokenWithUidAndPrivilege(
    appId,
    appCertificate,
    channelName,
    uid,
    tokenExpire,
    joinChannelPrivilegeExpire,
    pubAudioPrivilegeExpire,
    pubVideoPrivilegeExpire,
    pubDataStreamPrivilegeExpire
  ) {
    return this.BuildTokenWithUserAccountAndPrivilege(
      appId,
      appCertificate,
      channelName,
      uid,
      tokenExpire,
      joinChannelPrivilegeExpire,
      pubAudioPrivilegeExpire,
      pubVideoPrivilegeExpire,
      pubDataStreamPrivilegeExpire
    );
  }

  /**
   * Generates an RTC token with the specified privilege.
   *
   * This method supports generating a token with the following privileges:
   * - Joining an RTC channel.
   * - Publishing audio in an RTC channel.
   * - Publishing video in an RTC channel.
   * - Publishing data streams in an RTC channel.
   *
   * The privileges for publishing audio, video, and data streams in an RTC channel apply only if you have
   * enabled co-host authentication.
   *
   * A user can have multiple privileges. Each privilege is valid for a maximum of 24 hours.
   * The SDK triggers the onTokenPrivilegeWillExpire and onRequestToken callbacks when the token is about to expire
   * or has expired. The callbacks do not report the specific privilege affected, and you need to maintain
   * the respective timestamp for each privilege in your app logic. After receiving the callback, you need
   * to generate a new token, and then call renewToken to pass the new token to the SDK, or call joinChannel to re-join
   * the channel.
   *
   * @note
   * Agora recommends setting a reasonable timestamp for each privilege according to your scenario.
   * Suppose the expiration timestamp for joining the channel is set earlier than that for publishing audio.
   * When the token for joining the channel expires, the user is immediately kicked off the RTC channel
   * and cannot publish any audio stream, even though the timestamp for publishing audio has not expired.
   *
   * @param appId The App ID of your Agora project.
   * @param appCertificate The App Certificate of your Agora project.
   * @param channelName The unique channel name for the Agora RTC session in string format. The string length must be less than 64 bytes. The channel name may contain the following characters:
   * - All lowercase English letters: a to z.
   * - All uppercase English letters: A to Z.
   * - All numeric characters: 0 to 9.
   * - The space character.
   * - "!", "#", "$", "%", "&", "(", ")", "+", "-", ":", ";", "<", "=", ".", ">", "?", "@", "[", "]", "^", "_", " {", "}", "|", "~", ",".
   * @param userAccount The user account.
   * @param tokenExpire represented by the number of seconds elapsed since now. If, for example, you want to access the
   * Agora Service within 10 minutes after the token is generated, set token_expire as 600(seconds).
   * @param joinChannelPrivilegeExpire The Unix timestamp when the privilege for joining the channel expires, represented
   * by the sum of the current timestamp plus the valid time period of the token. For example, if you set joinChannelPrivilegeExpire as the
   * current timestamp plus 600 seconds, the token expires in 10 minutes.
   * @param pubAudioPrivilegeExpire The Unix timestamp when the privilege for publishing audio expires, represented
   * by the sum of the current timestamp plus the valid time period of the token. For example, if you set pubAudioPrivilegeExpire as the
   * current timestamp plus 600 seconds, the token expires in 10 minutes. If you do not want to enable this privilege,
   * set pubAudioPrivilegeExpire as the current Unix timestamp.
   * @param pubVideoPrivilegeExpire The Unix timestamp when the privilege for publishing video expires, represented
   * by the sum of the current timestamp plus the valid time period of the token. For example, if you set pubVideoPrivilegeExpire as the
   * current timestamp plus 600 seconds, the token expires in 10 minutes. If you do not want to enable this privilege,
   * set pubVideoPrivilegeExpire as the current Unix timestamp.
   * @param pubDataStreamPrivilegeExpire The Unix timestamp when the privilege for publishing data streams expires, represented
   * by the sum of the current timestamp plus the valid time period of the token. For example, if you set pubDataStreamPrivilegeExpire as the
   * current timestamp plus 600 seconds, the token expires in 10 minutes. If you do not want to enable this privilege,
   * set pubDataStreamPrivilegeExpire as the current Unix timestamp.
   * @return The new Token.
   */
  static BuildTokenWithUserAccountAndPrivilege(
    appId,
    appCertificate,
    channelName,
    account,
    tokenExpire,
    joinChannelPrivilegeExpire,
    pubAudioPrivilegeExpire,
    pubVideoPrivilegeExpire,
    pubDataStreamPrivilegeExpire
  ) {
    const token = new AccessToken(appId, appCertificate, 0, tokenExpire);

    const serviceRtc = new ServiceRtc(channelName, account);
    serviceRtc.add_privilege(
      ServiceRtc.kPrivilegeJoinChannel,
      joinChannelPrivilegeExpire
    );
    serviceRtc.add_privilege(
      ServiceRtc.kPrivilegePublishAudioStream,
      pubAudioPrivilegeExpire
    );
    serviceRtc.add_privilege(
      ServiceRtc.kPrivilegePublishVideoStream,
      pubVideoPrivilegeExpire
    );
    serviceRtc.add_privilege(
      ServiceRtc.kPrivilegePublishDataStream,
      pubDataStreamPrivilegeExpire
    );
    token.add_service(serviceRtc);

    return token.build();
  }
}
