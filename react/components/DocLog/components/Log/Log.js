import React, { Component } from 'react';
import {
  Icon,
} from 'choerodon-ui';
import { Button } from 'choerodon-ui/pro';
import UserHead from '../../../UserHead';
import './Log.less';

class Log extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      expand: false,
    };
  }

  getOperation = (log) => {
    const { operation, field } = log;
    switch (operation) {
      case 'Create':
        switch (field) {
          case 'Page':
            return '创建';
          case 'Comment':
            return '新增';
          case 'Attachment':
            return '上传';
          default:
            break;
        }
        break;
      case 'Update':
        switch (field) {
          case 'Page':
            return '更新';
          case 'Comment':
            return '修改';
          default:
            break;
        }
        break;
      case 'Delete':
        switch (field) {
          case 'Comment':
            return '删除';
          case 'Attachment':
            return '删除';
          default:
            break;
        }
        break;
      default:
        break;
    }
  };

  getModeField = (log) => {
    const { operation, field } = log;
    switch (operation) {
      case 'Create':
        switch (field) {
          case 'Page':
            return '【文档】';
          case 'Comment':
            return '【评论】';
          case 'Attachment':
            return '【附件】';
          default:
            break;
        }
        break;
      case 'Update':
        switch (field) {
          case 'Page':
            return '【文档】';
          case 'Comment':
            return '【评论】';
          default:
            break;
        }
        break;
      case 'Delete':
        switch (field) {
          case 'Comment':
            return '【评论】';
          case 'Attachment':
            return '【附件】';
          default:
            break;
        }
        break;
      default:
        break;
    }
  };

  getModeValue = (log) => {
    const {
      operation, field, newString, oldString,
    } = log;
    switch (operation) {
      case 'Create':
        switch (field) {
          case 'Attachment':
            return `【${newString}】`;
          default:
            break;
        }
        break;
      case 'Update':
        break;
      case 'Delete':
        switch (field) {
          case 'Attachment':
            return `【${oldString}】`;
          default:
            break;
        }
        break;
      default:
        break;
    }
  };

  getFirst = (str) => {
    if (!str) {
      return '';
    }
    const re = /[\u4E00-\u9FA5]/g;
    for (let i = 0, len = str.length; i < len; i += 1) {
      if (re.test(str[i])) {
        return str[i];
      }
    }
    return str[0];
  };

  renderLog = (log, index) => {
    const { expand } = this.state;
    return (
      <div className="c7n-doc-log-wrapper">
        {
          index > 4 && !expand ? null : (
            <div key={log.logId}>
              <div style={{ flex: 1, borderBottom: '1px solid var(--divider)', padding: '8.5px 20px' }}>
                <div>
                  <UserHead
                    style={{ display: 'inline-flex' }}
                    user={log.createUser}
                    color="var(--primary-color)"
                  />
                  <div style={{ display: 'inline', marginLeft: 5, verticalAlign: 'top' }}>
                    <span>
                      {this.getOperation(log)}
                    </span>
                    <span style={{ color: 'var(--primary-color)' }}>
                      {this.getModeField(log)}
                    </span>
                    <span style={{ color: 'var(--primary-color)', wordBreak: 'break-all' }}>
                      {this.getModeValue(log)}
                    </span>
                  </div>
                </div>
                <div style={{ marginTop: 5, color: 'var(--text-color3)' }}>
                  {log.lastUpdateDate || ''}
                </div>
              </div>
            </div>
          )
        }
      </div>
    );
  };

  render() {
    const { data } = this.props;
    return (
      <div className="c7n-doc-log">
        {
          data.map((log, index) => this.renderLog(log, index))
        }
        {
          data.length > 5 && !this.state.expand ? (
            <div style={{ marginTop: 10, marginLeft: 20 }}>
              <Button className="leftBtn" onClick={() => this.setState({ expand: true })}>
                <Icon type="baseline-arrow_right icon" style={{ marginRight: 2 }} />
                <span>展开</span>
              </Button>
            </div>
          ) : null
        }
        {
          data.length > 5 && this.state.expand ? (
            <div style={{ marginTop: 10, marginLeft: 20 }}>
              <Button className="leftBtn" onClick={() => this.setState({ expand: false })}>
                <Icon type="baseline-arrow_drop_up icon" style={{ marginRight: 2 }} />
                <span>收起</span>
              </Button>
            </div>
          ) : null
        }
      </div>
    );
  }
}

export default Log;
