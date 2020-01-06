import axios from 'axios';
import { observable, action, computed, toJS } from 'mobx';
import { Choerodon } from '@choerodon/boot';
import { getProjectBaseList, getOrgBaseList } from '../../../api/knowledgebaseApi';

class KnowledgeHomeStore {
    @observable projectBaseList = [];

    @action setProjectBaseList = (projectBaseList) => {
      this.projectBaseList = projectBaseList;
    }

    @observable orgBaseList = [];

    @action setOrgBaseList = (orgBaseList) => {
      this.orgBaseList = orgBaseList;
    }

    @observable binList = [];

    @action setBinList = (binList) => {
      this.binList = binList;
    }

    axiosProjectBaseList = () => {
      getProjectBaseList().then((res) => {
        this.setProjectBaseList(res);
      }).catch((e) => {
        Choerodon.prompt('获取项目下的知识库失败');
      });
    }

    axiosOrgBaseList = () => {
      getOrgBaseList().then((res) => {
        this.setOrgBaseList(res);
      }).catch(() => {
        Choerodon.prompt('获取组织下的知识库失败');
      });
    }
}
export default KnowledgeHomeStore;