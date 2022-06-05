(function (win, doc) {
  const sourceMap = {};
  const sourceMapReverse = {};
  let cursor = 0;
  let timer = null;

  function openVscode(node) {
    let path = null;
    if (node.dataset.sid) {
      path = sidToURI(node.dataset.sid);
    }
    if (node.dataset.source) {
      path = 'vscode://file/' + node.dataset.source;
    }
    if (!path) {
      return console.warn('Not found data-source');
    }
    win.location.href = path;
  }
  function sourceToId(node) {
    if (!node.dataset.source) return;
    const source = node.dataset.source;
    const splits = source.split(':');
    const column = splits.pop();
    const row = splits.pop();
    const file = splits.join(':');

    if (!sourceMap[file]) {
      cursor++;
      sourceMap[file] = cursor;
      sourceMapReverse[cursor] = file;
    }
    const id = sourceMap[file];
    node.removeAttribute('data-source');
    node.setAttribute('data-sid', `${id}:${row}:${column}`);
  }
  function sidToURI(sid) {
    const [id, row, column] = sid.split(':');
    const path =
      'vscode://file/' + sourceMapReverse[id] + ':' + row + ':' + column;
    return path;
  }

  class Selector {
    constructor(node) {
      this.sids = [];
      this.containerId = '__source-ref-panel';
      this.getAncestorSids = (node) => {
        const sids = [];
        let cur = node;
        while (cur !== doc.body) {
          if (cur.dataset.sid) {
            sids.push(cur.dataset.sid);
          }
          cur = cur.parentElement;
        }
        return sids;
      };
      this.focusBlock = null;
      this.setFocusBlock = (target) => {
        if (target === null) {
          // clear if target is null
          if (this.focusBlock) {
            doc.body.removeChild(this.focusBlock);
            this.focusBlock = null;
          }
          return;
        }

        if (!this.focusBlock) {
          this.focusBlock = doc.createElement('div');
          this.focusBlock.className = '__source-ref-mask';
          this.focusBlock.style.position = 'absolute';
          this.focusBlock.style.backgroundColor = 'rgba(134, 185, 242, 0.5)';

          doc.body.appendChild(this.focusBlock);
        }

        const rect = target.getBoundingClientRect();

        this.focusBlock.style.height = rect.height + 'px';
        this.focusBlock.style.width = rect.width + 'px';
        this.focusBlock.style.left = rect.x + 'px';
        this.focusBlock.style.top = rect.y + 'px';
      };
      this.getContainer = () => {
        const container = doc.getElementById(this.containerId);
        if (!container) {
          const div = doc.createElement('div');
          div.id = this.containerId;
          doc.body.appendChild(div);

          // Add dom red border on hover
          div.addEventListener('mouseover', (e) => {
            const node = e.target;
            if (node.dataset.tid) {
              const target = doc.querySelector(
                `[data-sid="${node.dataset.tid}"]`
              );
              if (target) {
                target.classList.add('__source-ref-selected');
                this.setFocusBlock(target);
              }
            }
          });

          // Remove dom red border when leave
          div.addEventListener('mouseout', (e) => {
            const node = e.target;
            if (node.dataset.tid) {
              const target = doc.querySelector(
                `[data-sid="${node.dataset.tid}"]`
              );
              if (target) {
                target.classList.remove('__source-ref-selected');
              }
            }
          });

          const close = () => {
            this.setFocusBlock(null);
            doc.body.removeChild(div);
          };

          // click event
          div.addEventListener('click', (e) => {
            const node = e.target;
            const command = node.dataset.command;
            switch (command) {
              case 'close': {
                e.stopPropagation();
                close();
                return;
              }
              default:
                console.warn('Unknown command', command);
            }
          });

          // keyboard event
          function escKeyHandler(e) {
            if (e.key === 'Escape') {
              e.stopPropagation();
              close();
              doc.removeEventListener('keydown', escKeyHandler);
            }
          }
          doc.addEventListener('keydown', escKeyHandler);

          return div;
        }
        return container;
      };
      this.renderHTML = () => {
        const html = `
        <div style="
          position: fixed;
          background: white;
          bottom: 0;
          left: 0;
          z-index: 9999;
          opacity: 0.6;
          border-radius: 0 10px 0 0;
        ">
          <div style="cursor:pointer;margin:10px;text-align:right;font-size:18px;" data-command="close">X</div>
          ${this.sids
            .map((sid) => {
              const uri = sidToURI(sid);
              // 这里加了一个左向省略，暂时没用上，先放着
              return `<a href="${uri}" style="
                display: block;
                margin: 10px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                direction: rtl;
                text-align: left;
              " data-tid="${sid}">source-ref: ${uri}</a>`;
            })
            .join('')}
        </div>
      `;
        const container = this.getContainer();
        container.innerHTML = html;
      };
      this.sids = this.getAncestorSids(node);
    }
  }
  function init() {
    win.vscode = (node = win.$0) => {
      openVscode(node);
    };
    doc.body.addEventListener(
      'click',
      (e) => {
        if (e.altKey) {
          e.preventDefault();
          e.stopPropagation();
          const selector = new Selector(e.target);
          selector.renderHTML();
        }
      },
      true
    );
    const mo = new MutationObserver(() => {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        // recal sid
        doc
          .querySelectorAll('[data-source]')
          .forEach((node) => sourceToId(node));
      }, 500);
    });
    mo.observe(doc.body, {
      attributes: true,
      childList: true,
      subtree: true,
    });
  }
  init();
})(window, document);
