package io.choerodon.kb.domain.kb.repository;

import java.util.List;

import io.choerodon.kb.infra.dto.PageLogDTO;

/**
 * Created by Zenger on 2019/4/29.
 */
public interface PageLogRepository {

    PageLogDTO insert(PageLogDTO pageLogDTO);

    List<PageLogDTO> selectByPageId(Long pageId);

    void deleteByPageId(Long pageId);
}
