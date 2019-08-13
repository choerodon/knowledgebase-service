import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import TimeAgo from 'timeago-react';
import { FormattedMessage } from 'react-intl';
import {
  BackTop, Input, Icon, Button,
} from 'choerodon-ui';
import 'codemirror/lib/codemirror.css';
import 'tui-editor/dist/tui-editor.min.css';
import 'tui-editor/dist/tui-editor-contents.min.css';
import '../Extensions/table/table';
import { Viewer } from '@toast-ui/react-editor';
import Lightbox from 'react-image-lightbox';
import DocHeader from '../DocHeader';
import DocAttachment from '../doc-attachment';
import DocComment from '../doc-comment';
import './DocViewer.scss';

class DocViewer extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      hasImageViewer: false,
      imgSrc: false,
      editTitle: false,
      loading: false,
    };
  }

  componentDidMount() {
    window.addEventListener('click', this.onImageClick);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.onImageClick);
  }

  onImageClick = (e) => {
    const { hasImageViewer } = this.state;
    if (!hasImageViewer) {
      if (e && e.target && e.target.nodeName === 'IMG' && e.target.className === '') {
        this.setState({
          hasImageViewer: true,
          imgSrc: e.target.src,
        });
        e.stopPropagation();
      }
    }
  };

  onViewerClose = () => {
    this.setState({
      hasImageViewer: false,
      imgSrc: false,
    });
  };

  handleClickTitle = () => {
    this.setState({
      editTitle: true,
    });
  };

  handleCancel = () => {
    this.setState({
      editTitle: false,
      newTitle: false,
      loading: false,
    });
  };

  handleTitleChange = (e) => {
    this.setState({
      newTitle: e.target.value,
    });
  };

  handleSubmit = () => {
    const { newTitle } = this.state;
    const { store } = this.props;
    if (newTitle && newTitle.trim()) {
      this.setState({
        loading: true,
      });
      const { getDoc: { pageInfo: { objectVersionNumber }, workSpace: { id } } } = store;
      const doc = {
        title: newTitle,
        objectVersionNumber,
      };
      store.editDoc(id, doc);
    }
    this.handleCancel();
  };

  render() {
    const { hasImageViewer, imgSrc, editTitle, loading } = this.state;
    const {
      data,
      searchVisible = false,
      store,
      readOnly,
      fullScreen,
      editDoc,
      exitFullScreen,
    } = this.props;
    return (
      <div className="c7n-docViewer">
        <DocHeader {...this.props} breadcrumb={!searchVisible} />
        <div className="c7n-docViewer-wrapper" id="docViewer-scroll">
          <DocAttachment store={store} readOnly={readOnly} />
          <div className="c7n-docViewer-content">
            {editTitle
              ? (
                <span>
                  <Input
                    size="large"
                    showLengthInfo={false}
                    maxLength={40}
                    style={{ maxWidth: 684, width: 'calc(100% - 150px)' }}
                    defaultValue={data.pageInfo.title || ''}
                    onChange={this.handleTitleChange}
                  />
                  <Button
                    funcType="raised"
                    type="primary"
                    style={{ marginLeft: 10, verticalAlign: 'middle' }}
                    onClick={this.handleSubmit}
                    loading={loading}
                  >
                    <FormattedMessage id="save" />
                  </Button>
                  <Button
                    funcType="raised"
                    style={{ marginLeft: 10, verticalAlign: 'middle' }}
                    onClick={this.handleCancel}
                  >
                    <FormattedMessage id="cancel" />
                  </Button>
                </span>
              ) : (
                <div className="c7n-docViewer-title">
                  {data.pageInfo.title}
                  <Icon
                    type="mode_edit"
                    className="c7n-docHeader-title-edit"
                    onClick={this.handleClickTitle}
                  />
                  {fullScreen
                    ? (
                      <span style={{ float: 'right', margin: '-2px 5px 0 0' }}>
                        <Button type="primary" funcType="flat" onClick={editDoc}>
                          <Icon type="mode_edit icon" />
                          <FormattedMessage id="edit" />
                        </Button>
                        <Button type="primary" funcType="flat" onClick={exitFullScreen}>
                          <Icon type="fullscreen_exit" />
                          <FormattedMessage id="exitFullScreen" />
                        </Button>
                      </span>
                    ) : null
                  }
                </div>
              )
            }
            <Viewer
              initialValue={searchVisible ? data.pageInfo.highlightContent : data.pageInfo.content}
              usageStatistics={false}
              exts={[
                'table',
                'attachment',
              ]}
            />
          </div>
          <div className="c7n-docViewer-footer">
            <div>
              <span className="c7n-docViewer-mRight">创建者</span>
              <span className="c7n-docViewer-mRight">{data.pageInfo.createName}</span>
              {'（'}
              <TimeAgo
                datetime={data.pageInfo.creationDate}
                locale={Choerodon.getMessage('zh_CN', 'en')}
              />
              {'）'}
            </div>
            <div>
              <span className="c7n-docViewer-mRight">最近编辑</span>
              <span className="c7n-docViewer-mRight">{data.pageInfo.lastUpdatedName}</span>
              {'（'}
              <TimeAgo
                datetime={data.pageInfo.lastUpdateDate}
                locale={Choerodon.getMessage('zh_CN', 'en')}
              />
              {'）'}
            </div>
          </div>
          {!readOnly
            ? <DocComment data={data} store={store} />
            : null
          }
          <BackTop target={() => document.getElementById('docViewer-scroll')} />
        </div>
        {hasImageViewer
          ? (
            <Lightbox
              mainSrc={imgSrc}
              onCloseRequest={this.onViewerClose}
              imageTitle="images"
            />
          ) : ''
        }
      </div>
    );
  }
}
export default withRouter(DocViewer);
