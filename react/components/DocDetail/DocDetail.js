import React, { Component } from 'react';
import { throttle } from 'lodash';
import { Button } from 'choerodon-ui/pro';
import DocLog from '../DocLog';
import ResizeAble from '../ResizeAble';

import './DocDetail.less';

class DocDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.container = React.createRef();
  }

  componentDidMount() {
    const { store } = this.props;
    const { pageInfo: { id } } = store.getDoc;
    store.loadLog(id);
  }

  handleResizeEnd = ({ width }) => {
    localStorage.setItem('knowledge.docDetail.width', `${width}px`);
  };

  setQuery=(width = this.container.current.clientWidth) => {
    if (width <= 600) {
      this.container.current.setAttribute('max-width', '600px');
    } else {
      this.container.current.removeAttribute('max-width');
    }
  };

  handleResize = throttle(({ width }) => {
    this.setQuery(width);
  }, 150);

  render() {
    const { onCollapse } = this.props;

    return (
      <div className="c7n-docDetail">
        <ResizeAble
          modes={['left']}
          size={{
            maxWidth: 800,
            minWidth: 350,
          }}
          defaultSize={{
            width: localStorage.getItem('knowledge.docDetail.width') || 350,
            height: '100%',
          }}
          onResizeEnd={this.handleResizeEnd}
          onResize={this.handleResize}
        >
          <div className="c7n-docDetail-wrapper" ref={this.container}>
            <div className="c7n-docDetail-content">
              <div className="c7n-docDetail-header">
                <div className="c7n-docDetail-title">
                  操作历史
                </div>
                <Button
                  onClick={onCollapse}
                  shape="circle"
                  icon="close"
                  funcType="flat"
                />
              </div>
              <div className="c7n-docDetail-body" id="scroll-area">
                <DocLog {...this.props} />
              </div>
            </div>
          </div>
        </ResizeAble>
      </div>
    );
  }
}

export default DocDetail;
