import { GenshinRichtext } from '../GenshinRichtext';
import { render } from '@testing-library/react';
import React from 'react';

describe('GenshinRichtext', () => {
  const testRawRichtext = `「<color=#cc9046FF>陵薮</color>市朝」活动祈愿已开启。活动期间内，<color=#c93f23>限定</color>5星角色<color=#debd6c>「尘世闲游·钟离(岩)」</color>以及4星角色<color=#00BFFF>「少年春衫薄·行秋(水)」</color>、<color=#945dc4>「无冕的龙王·北斗(雷)」</color>、<color=#EC4923>「智明无邪·烟绯(火)」</color>的祈愿获取概率将<color=#c93f23>大幅提升</color>！</P>
  <color=#c93f23>※以上角色中，限定角色不会进入「奔行世间」常驻祈愿。 </color></P>
  <br />
  ※一般情况下所有角色或武器均适用基础概率，如触发概率UP、保底等以具体规则为准。 </P>
  <br />
  〓祈愿规则〓</P>
  【5星物品】</P>
  在本期「<color=#cc9046FF>陵薮</color>市朝」活动祈愿中，5星角色祈愿的基础概率为<color=#c93f23>0.600%</color>，综合概率（含保底）为<color=#c93f23>1.600%</color>，最多<color=#c93f23>90</color>次祈愿必定能通过保底获取5星角色。</P>
  当祈愿获取到5星角色时，有<color=#c93f23>50.000%</color>的概率为本期5星UP角色<color=#debd6c>「尘世闲游·钟离(岩)」</color>。如果本次祈愿获取的5星角色非本期5星UP角色，下次祈愿获取的5星角色<color=#c93f23>必定</color>为本期5星UP角色。</P>
  【4星物品】</P>
  在本期「<color=#cc9046FF>陵薮</color>市朝」活动祈愿中，4星物品祈愿的基础概率为<color=#c93f23>5.100%</color>，4星角色祈愿的基础概率为<color=#c93f23>2.550%</color>，4星武器祈愿的基础概率为<color=#c93f23>2.550%</color>，4星物品祈愿的综合概率（含保底）为<color=#c93f23>13.000%</color>。最多<color=#c93f23>10</color>次祈愿必定能通过保底获取4星或以上物品，通过保底获取4星物品的概率为<color=#c93f23>99.400%</color>，获取5星物品的概率为<color=#c93f23>0.600%</color>。</P>
  当祈愿获取到4星物品时，有<color=#c93f23>50.000%</color>的概率为本期4星UP角色<color=#00BFFF>「少年春衫薄·行秋(水)」</color>、<color=#945dc4>「无冕的龙王·北斗(雷)」</color>、<color=#EC4923>「智明无邪·烟绯(火)」</color>中的一个。如果本次祈愿获取的4星物品非本期4星UP角色，下次祈愿获取的4星物品<color=#c93f23>必定</color>为本期4星UP角色。当祈愿获取到4星UP物品时，每个本期4星UP角色的获取概率均等。</P>
  <br />
  获得4星武器时，会同时获得2个<color=#bd6932>无主的星辉</color>作为副产物；获得3星武器时，会同时获得15个<color=#a256e1>无主的星尘</color>作为副产物。</P>
  <br />
  〓若获得重复角色〓</P>
  无论通过何种方式（包含但不限于祈愿、商城兑换、系统赠送等）第2~7次获得相同5星角色时，每次将转化为1个<color=#a256e1>对应角色的命星</color>和10个<color=#bd6932>无主的星辉</color>；第8次及之后获得，将仅转化为25个<color=#bd6932>无主的星辉</color>。</P>
  无论通过何种方式（包含但不限于祈愿、商城兑换、系统赠送等）第2~7次获得相同4星角色时，每次将转化为1个<color=#a256e1>对应角色的命星</color>和2个<color=#bd6932>无主的星辉</color>；第8次及之后获得，将仅转化为5个<color=#bd6932>无主的星辉</color>。</P>
  <br />
  ※本祈愿属于「角色活动祈愿」，「角色活动祈愿」和「角色活动祈愿-2」的祈愿次数保底完全共享，会一直共同累计在「角色活动祈愿」和「角色活动祈愿-2」中，与其他祈愿的祈愿次数保底相互独立计算，互不影响。</P>`;

  test('test', () => {
    const wrapper = render(<GenshinRichtext raw={testRawRichtext} />);
    expect(wrapper.container).toMatchSnapshot();
  });
});
