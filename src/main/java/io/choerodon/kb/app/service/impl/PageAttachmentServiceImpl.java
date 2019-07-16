package io.choerodon.kb.app.service.impl;

import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.List;

import io.choerodon.kb.api.dao.AttachmentSearchVO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import io.choerodon.core.convertor.ConvertHelper;
import io.choerodon.core.exception.CommonException;
import io.choerodon.kb.api.dao.PageAttachmentVO;
import io.choerodon.kb.app.service.PageAttachmentService;
import io.choerodon.kb.domain.kb.repository.PageAttachmentRepository;
import io.choerodon.kb.domain.kb.repository.PageRepository;
import io.choerodon.kb.infra.common.BaseStage;
import io.choerodon.kb.infra.dto.PageAttachmentDTO;
import io.choerodon.kb.infra.dto.PageDTO;
import io.choerodon.kb.infra.feign.FileFeignClient;

/**
 * Created by Zenger on 2019/4/30.
 */
@Service
@Transactional(rollbackFor = Exception.class)
public class PageAttachmentServiceImpl implements PageAttachmentService {

    private static final Logger LOGGER = LoggerFactory.getLogger(PageAttachmentServiceImpl.class);

    @Value("${services.attachment.url}")
    private String attachmentUrl;

    private FileFeignClient fileFeignClient;
    private PageRepository pageRepository;
    private PageAttachmentRepository pageAttachmentRepository;

    public PageAttachmentServiceImpl(FileFeignClient fileFeignClient,
                                     PageRepository pageRepository,
                                     PageAttachmentRepository pageAttachmentRepository) {
        this.fileFeignClient = fileFeignClient;
        this.pageRepository = pageRepository;
        this.pageAttachmentRepository = pageAttachmentRepository;
    }

    @Override
    public List<PageAttachmentVO> create(Long pageId,
                                         List<MultipartFile> files) {
        List<Long> ids = new ArrayList<>();
        List<PageAttachmentVO> list = new ArrayList<>();
        PageDTO pageDTO = pageRepository.selectById(pageId);
        if (!(files != null && !files.isEmpty())) {
            throw new CommonException("error.attachment.exits");
        }
        for (MultipartFile multipartFile : files) {
            String fileName = multipartFile.getOriginalFilename();
            ResponseEntity<String> response = fileFeignClient.uploadFile(BaseStage.BACKETNAME, fileName, multipartFile);
            if (response == null || response.getStatusCode() != HttpStatus.OK) {
                throw new CommonException("error.attachment.upload");
            }
            ids.add(this.insertPageAttachment(fileName,
                    pageDTO.getId(),
                    multipartFile.getSize(),
                    dealUrl(response.getBody())).getId());
        }
        if (!ids.isEmpty()) {
            String urlSlash = attachmentUrl.endsWith("/") ? "" : "/";
            list = ConvertHelper.convertList(pageAttachmentRepository.selectByIds(ids), PageAttachmentVO.class);
            list.stream().forEach(p -> p.setUrl(attachmentUrl + urlSlash + p.getUrl()));
        }

        return list;
    }

    @Override
    public List<String> uploadForAddress(List<MultipartFile> files) {
        if (!(files != null && !files.isEmpty())) {
            throw new CommonException("error.attachment.exits");
        }
        List<String> result = new ArrayList<>();
        String urlSlash = attachmentUrl.endsWith("/") ? "" : "/";
        for (MultipartFile multipartFile : files) {
            String fileName = multipartFile.getOriginalFilename();
            ResponseEntity<String> response = fileFeignClient.uploadFile(BaseStage.BACKETNAME, fileName, multipartFile);
            if (response == null || response.getStatusCode() != HttpStatus.OK) {
                throw new CommonException("error.attachment.upload");
            }
            result.add(attachmentUrl + urlSlash + dealUrl(response.getBody()));
        }
        return result;
    }

    @Override
    public List<PageAttachmentVO> queryByList(Long pageId) {
        List<PageAttachmentDTO> pageAttachments = pageAttachmentRepository.selectByPageId(pageId);
        if (pageAttachments != null && !pageAttachments.isEmpty()) {
            String urlSlash = attachmentUrl.endsWith("/") ? "" : "/";
            pageAttachments.stream().forEach(pageAttachmentDO -> pageAttachmentDO.setUrl(attachmentUrl + urlSlash + pageAttachmentDO.getUrl()));
        }
        return ConvertHelper.convertList(pageAttachments, PageAttachmentVO.class);
    }

    @Override
    public void delete(Long id) {
        PageAttachmentDTO pageAttachmentDTO = pageAttachmentRepository.selectById(id);

        String urlSlash = attachmentUrl.endsWith("/") ? "" : "/";
        pageAttachmentRepository.delete(id);
        try {
            fileFeignClient.deleteFile(BaseStage.BACKETNAME, attachmentUrl + urlSlash + URLDecoder.decode(pageAttachmentDTO.getUrl(), "UTF-8"));
        } catch (Exception e) {
            LOGGER.error("error.attachment.delete", e);
        }
    }

    @Override
    public PageAttachmentDTO insertPageAttachment(String name, Long pageId, Long size, String url) {
        PageAttachmentDTO pageAttachmentDTO = new PageAttachmentDTO();
        pageAttachmentDTO.setName(name);
        pageAttachmentDTO.setPageId(pageId);
        pageAttachmentDTO.setSize(size);
        pageAttachmentDTO.setUrl(url);
        return pageAttachmentRepository.insert(pageAttachmentDTO);
    }

    @Override
    public String dealUrl(String url) {
        String dealUrl = null;
        try {
            URL netUrl = new URL(url);
            dealUrl = netUrl.getFile().substring(BaseStage.BACKETNAME.length() + 2);
        } catch (MalformedURLException e) {
            throw new CommonException(e.getMessage());
        }
        return dealUrl;
    }

    @Override
    public void deleteFile(String url) {
        try {
            String urlSlash = attachmentUrl.endsWith("/") ? "" : "/";
            fileFeignClient.deleteFile(BaseStage.BACKETNAME, attachmentUrl + urlSlash + URLDecoder.decode(url, "UTF-8"));
        } catch (Exception e) {
            LOGGER.error("error.attachment.delete", e);
        }
    }

    @Override
    public List<PageAttachmentVO> searchAttachment(AttachmentSearchVO attachmentSearchVO) {
        if (attachmentSearchVO.getProjectId() != null) {
            return ConvertHelper.convertList(pageAttachmentRepository.searchAttachment(null, attachmentSearchVO.getProjectId(), attachmentSearchVO.getFileName(), attachmentUrl), PageAttachmentVO.class);
        } else if (attachmentSearchVO.getOrganizationId() != null) {
            return ConvertHelper.convertList(pageAttachmentRepository.searchAttachment(attachmentSearchVO.getOrganizationId(), null, attachmentSearchVO.getFileName(), attachmentUrl), PageAttachmentVO.class);
        }
        return new ArrayList<>();
    }
}
