import React, {
  useEffect, useMemo, useCallback,
} from 'react';
import {
  Modal, Form, DataSet, TextArea, TextField,
} from 'choerodon-ui/pro';
import { observer } from 'mobx-react-lite';
import DataSetFactory from './dataSet';
import './index.less';

const key = Modal.key();

const propTypes = {

};
const defaultProps = {

};
function CreateTemplate({
  modal, pageStore, baseTemplate,
}) {
  const dataSet = useMemo(() => new DataSet(DataSetFactory({ pageStore, baseTemplate })), []);
  dataSet.create(baseTemplate ? {
    title: baseTemplate.title,
    description: baseTemplate.description,
  } : {});
  const handleSubmit = useCallback(async () => {
    const res = await dataSet.submit();
    if (res && pageStore.templateDataSet) {
      pageStore.templateDataSet.query();
    }
    return res;
  }, [dataSet]);
  useEffect(() => {
    modal.handleOk(handleSubmit);
  }, [modal, handleSubmit]);

  return (
    <Form dataSet={dataSet} className="c7ntest-createTemplate-form">
      <TextField name="title" maxLength={44} valueChangeAction="input" />
      <TextArea name="description" />
    </Form>
  );
}
CreateTemplate.propTypes = propTypes;
CreateTemplate.defaultProps = defaultProps;
const ObserverCreateDocModal = observer(CreateTemplate);
export default function openCreateTemplate({
  pageStore, baseTemplate,
}) {
  Modal.open({
    title: '创建模板',
    key,
    okText: '创建',
    children: <ObserverCreateDocModal pageStore={pageStore} baseTemplate={baseTemplate} />,
  });
}
