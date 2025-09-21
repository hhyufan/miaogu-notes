-- 喵咕笔记平台数据库表结构
-- 创建数据库
CREATE DATABASE IF NOT EXISTS miaogu_notes DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE miaogu_notes;

-- 1. 用户表
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
    email VARCHAR(100) NOT NULL UNIQUE COMMENT '邮箱',
    password VARCHAR(255) NOT NULL COMMENT '密码(加密)',
    nickname VARCHAR(100) COMMENT '昵称',
    avatar_url VARCHAR(500) COMMENT '头像URL',
    bio TEXT COMMENT '个人简介(Markdown格式)',
    role ENUM('USER', 'ADMIN') DEFAULT 'USER' COMMENT '用户角色',
    status ENUM('ACTIVE', 'INACTIVE', 'BANNED') DEFAULT 'ACTIVE' COMMENT '用户状态',
    email_verified BOOLEAN DEFAULT FALSE COMMENT '邮箱是否验证',
    github_id VARCHAR(100) COMMENT 'GitHub用户ID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_username (username)
) COMMENT '用户表';

-- 2. AI配置表已删除(网站统一提供AI服务，用户无需自行配置)

-- 2. 管理员角色权限表
CREATE TABLE admin_roles (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    role_name VARCHAR(50) NOT NULL UNIQUE COMMENT '角色名称',
    role_code VARCHAR(50) NOT NULL UNIQUE COMMENT '角色代码',
    description TEXT COMMENT '角色描述',
    permissions JSON COMMENT '权限列表(JSON格式)',
    is_active BOOLEAN DEFAULT TRUE COMMENT '是否启用',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_role_code (role_code)
) COMMENT '管理员角色权限表';

-- 3. 管理员用户角色关联表
CREATE TABLE admin_user_roles (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    assigned_by BIGINT COMMENT '分配者ID',
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NULL COMMENT '过期时间',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES admin_roles(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_by) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE KEY unique_user_role (user_id, role_id),
    INDEX idx_user_id (user_id),
    INDEX idx_role_id (role_id)
) COMMENT '管理员用户角色关联表';

-- 4. 系统配置表
CREATE TABLE system_configs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    config_key VARCHAR(100) NOT NULL UNIQUE COMMENT '配置键',
    config_value TEXT COMMENT '配置值',
    config_type ENUM('STRING', 'NUMBER', 'BOOLEAN', 'JSON') DEFAULT 'STRING' COMMENT '配置类型',
    category VARCHAR(50) COMMENT '配置分类',
    description TEXT COMMENT '配置描述',
    is_public BOOLEAN DEFAULT FALSE COMMENT '是否公开(前端可访问)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_is_public (is_public)
) COMMENT '系统配置表';

-- 5. 管理员操作日志表
CREATE TABLE admin_operation_logs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    admin_id BIGINT NOT NULL COMMENT '管理员ID',
    operation_type VARCHAR(50) NOT NULL COMMENT '操作类型',
    resource_type VARCHAR(50) COMMENT '资源类型',
    resource_id BIGINT COMMENT '资源ID',
    operation_desc TEXT COMMENT '操作描述',
    request_data JSON COMMENT '请求数据',
    response_data JSON COMMENT '响应数据',
    ip_address VARCHAR(45) COMMENT 'IP地址',
    user_agent TEXT COMMENT '用户代理',
    status ENUM('SUCCESS', 'FAILED') DEFAULT 'SUCCESS' COMMENT '操作状态',
    error_message TEXT COMMENT '错误信息',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_admin_id (admin_id),
    INDEX idx_operation_type (operation_type),
    INDEX idx_resource_type (resource_type),
    INDEX idx_created_at (created_at),
    INDEX idx_status (status)
) COMMENT '管理员操作日志表';

-- 6. 内容审核表
CREATE TABLE content_reviews (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    content_type ENUM('NOTE', 'COMMENT', 'USER_PROFILE') NOT NULL COMMENT '内容类型',
    content_id BIGINT NOT NULL COMMENT '内容ID',
    reporter_id BIGINT COMMENT '举报者ID',
    report_reason VARCHAR(200) COMMENT '举报原因',
    review_status ENUM('PENDING', 'APPROVED', 'REJECTED', 'BANNED') DEFAULT 'PENDING' COMMENT '审核状态',
    reviewer_id BIGINT COMMENT '审核员ID',
    review_comment TEXT COMMENT '审核意见',
    reviewed_at TIMESTAMP NULL COMMENT '审核时间',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reporter_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_content_type_id (content_type, content_id),
    INDEX idx_review_status (review_status),
    INDEX idx_reviewer_id (reviewer_id),
    INDEX idx_created_at (created_at)
) COMMENT '内容审核表';

-- 7. 系统公告表
CREATE TABLE system_announcements (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL COMMENT '公告标题',
    content TEXT NOT NULL COMMENT '公告内容',
    announcement_type ENUM('SYSTEM', 'MAINTENANCE', 'FEATURE', 'WARNING') DEFAULT 'SYSTEM' COMMENT '公告类型',
    priority ENUM('LOW', 'MEDIUM', 'HIGH', 'URGENT') DEFAULT 'MEDIUM' COMMENT '优先级',
    target_users ENUM('ALL', 'ADMIN', 'NORMAL') DEFAULT 'ALL' COMMENT '目标用户',
    is_active BOOLEAN DEFAULT TRUE COMMENT '是否启用',
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '开始时间',
    end_time TIMESTAMP NULL COMMENT '结束时间',
    created_by BIGINT NOT NULL COMMENT '创建者ID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_announcement_type (announcement_type),
    INDEX idx_priority (priority),
    INDEX idx_target_users (target_users),
    INDEX idx_is_active (is_active),
    INDEX idx_start_time (start_time)
) COMMENT '系统公告表';

-- 8. 用户公告阅读记录表
CREATE TABLE user_announcement_reads (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    announcement_id BIGINT NOT NULL,
    read_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (announcement_id) REFERENCES system_announcements(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_announcement (user_id, announcement_id),
    INDEX idx_user_id (user_id),
    INDEX idx_announcement_id (announcement_id)
) COMMENT '用户公告阅读记录表';

-- 9. 好友关系表
CREATE TABLE friendships (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    requester_id BIGINT NOT NULL COMMENT '发起好友申请的用户ID',
    addressee_id BIGINT NOT NULL COMMENT '接收好友申请的用户ID',
    status ENUM('PENDING', 'ACCEPTED', 'REJECTED', 'BLOCKED') DEFAULT 'PENDING' COMMENT '好友状态',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (requester_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (addressee_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_friendship (requester_id, addressee_id),
    INDEX idx_requester (requester_id),
    INDEX idx_addressee (addressee_id)
) COMMENT '好友关系表';

-- 10. 笔记分类表
CREATE TABLE note_categories (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL COMMENT '分类名称',
    description TEXT COMMENT '分类描述',
    color VARCHAR(7) COMMENT '分类颜色(十六进制)',
    sort_order INT DEFAULT 0 COMMENT '排序顺序',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
) COMMENT '笔记分类表';

-- 11. 笔记表
CREATE TABLE notes (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    category_id BIGINT COMMENT '分类ID',
    title VARCHAR(200) NOT NULL COMMENT '笔记标题',
    content LONGTEXT COMMENT '笔记内容(Markdown格式)',
    summary TEXT COMMENT '笔记摘要',
    visibility ENUM('PUBLIC', 'FRIENDS', 'PRIVATE') DEFAULT 'PRIVATE' COMMENT '可见性',
    edit_permission ENUM('OWNER_ONLY', 'FRIENDS', 'PUBLIC') DEFAULT 'OWNER_ONLY' COMMENT '编辑权限',
    is_pinned BOOLEAN DEFAULT FALSE COMMENT '是否置顶',
    view_count INT DEFAULT 0 COMMENT '查看次数',
    like_count INT DEFAULT 0 COMMENT '点赞次数',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES note_categories(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_category_id (category_id),
    INDEX idx_visibility (visibility),
    INDEX idx_created_at (created_at),
    FULLTEXT idx_title_content (title, content)
) COMMENT '笔记表';

-- 12. 笔记标签表
CREATE TABLE note_tags (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE COMMENT '标签名称',
    color VARCHAR(7) COMMENT '标签颜色',
    usage_count INT DEFAULT 0 COMMENT '使用次数',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_name (name)
) COMMENT '笔记标签表';

-- 13. 笔记标签关联表
CREATE TABLE note_tag_relations (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    note_id BIGINT NOT NULL,
    tag_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES note_tags(id) ON DELETE CASCADE,
    UNIQUE KEY unique_note_tag (note_id, tag_id),
    INDEX idx_note_id (note_id),
    INDEX idx_tag_id (tag_id)
) COMMENT '笔记标签关联表';

-- 14. 笔记版本历史表
CREATE TABLE note_versions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    note_id BIGINT NOT NULL,
    version_number INT NOT NULL COMMENT '版本号',
    title VARCHAR(200) NOT NULL COMMENT '版本标题',
    content LONGTEXT COMMENT '版本内容',
    change_summary TEXT COMMENT '变更摘要',
    created_by BIGINT NOT NULL COMMENT '创建者ID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_note_id (note_id),
    INDEX idx_version (note_id, version_number)
) COMMENT '笔记版本历史表';

-- 15. 笔记附件表
CREATE TABLE note_attachments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    note_id BIGINT NOT NULL,
    filename VARCHAR(255) NOT NULL COMMENT '文件名',
    original_filename VARCHAR(255) NOT NULL COMMENT '原始文件名',
    file_path VARCHAR(500) NOT NULL COMMENT '文件路径',
    file_size BIGINT NOT NULL COMMENT '文件大小(字节)',
    file_type VARCHAR(100) COMMENT '文件类型',
    mime_type VARCHAR(100) COMMENT 'MIME类型',
    uploaded_by BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_note_id (note_id)
) COMMENT '笔记附件表';

-- 16. 题库表
CREATE TABLE question_banks (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    note_id BIGINT COMMENT '关联的笔记ID',
    question TEXT NOT NULL COMMENT '题目内容',
    question_type ENUM('FILL_BLANK') NOT NULL DEFAULT 'FILL_BLANK' COMMENT '题目类型(仅支持填空题)',
    difficulty ENUM('EASY', 'MEDIUM', 'HARD') DEFAULT 'MEDIUM' COMMENT '难度等级',
    note_position TEXT COMMENT '笔记中的位置信息(JSON格式)',
    original_answer TEXT COMMENT '原始答案(来自笔记内容)',
    alternative_answers JSON COMMENT '备选答案列表(用户自定义编辑)',
    explanation TEXT COMMENT '答案解析',
    ai_generated BOOLEAN DEFAULT FALSE COMMENT '是否AI生成',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_note_id (note_id),
    INDEX idx_difficulty (difficulty)
) COMMENT '题库表(仅支持填空题)';


-- 17. 题目标签表
CREATE TABLE question_tags (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE COMMENT '标签名称',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_name (name)
) COMMENT '题目标签表';

-- 18. 题目标签关联表
CREATE TABLE question_tag_relations (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    question_id BIGINT NOT NULL,
    tag_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (question_id) REFERENCES question_banks(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES question_tags(id) ON DELETE CASCADE,
    UNIQUE KEY unique_question_tag (question_id, tag_id)
) COMMENT '题目标签关联表';

-- 19. 答题记录表
CREATE TABLE answer_records (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    question_id BIGINT NOT NULL,
    user_answer TEXT COMMENT '用户答案',
    is_correct BOOLEAN COMMENT '是否正确',
    answer_time INT COMMENT '答题用时(秒)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES question_banks(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_question_id (question_id),
    INDEX idx_created_at (created_at)
) COMMENT '答题记录表';

-- 20. 答题会话表
CREATE TABLE answer_sessions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    session_name VARCHAR(100) COMMENT '会话名称',
    total_questions INT NOT NULL COMMENT '总题目数',
    correct_count INT DEFAULT 0 COMMENT '正确数量',
    total_time INT COMMENT '总用时(秒)',
    status ENUM('IN_PROGRESS', 'COMPLETED', 'ABANDONED') DEFAULT 'IN_PROGRESS' COMMENT '会话状态',
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status)
) COMMENT '答题会话表';

-- 21. 答题会话详情表
CREATE TABLE answer_session_details (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    session_id BIGINT NOT NULL,
    question_id BIGINT NOT NULL,
    user_answer TEXT COMMENT '用户答案',
    is_correct BOOLEAN COMMENT '是否正确',
    answer_time INT COMMENT '答题用时(秒)',
    question_order INT NOT NULL COMMENT '题目顺序',
    FOREIGN KEY (session_id) REFERENCES answer_sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES question_banks(id) ON DELETE CASCADE,
    INDEX idx_session_id (session_id)
) COMMENT '答题会话详情表';

-- 22. 笔记点赞表
CREATE TABLE note_likes (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    note_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_note_like (note_id, user_id),
    INDEX idx_note_id (note_id),
    INDEX idx_user_id (user_id)
) COMMENT '笔记点赞表';

-- 23. 笔记评论表
CREATE TABLE note_comments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    note_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    parent_id BIGINT COMMENT '父评论ID(用于回复)',
    content TEXT NOT NULL COMMENT '评论内容',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES note_comments(id) ON DELETE CASCADE,
    INDEX idx_note_id (note_id),
    INDEX idx_user_id (user_id),
    INDEX idx_parent_id (parent_id)
) COMMENT '笔记评论表';

-- 24. 系统通知表
CREATE TABLE notifications (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL COMMENT '接收通知的用户ID',
    type ENUM('FRIEND_REQUEST', 'FRIEND_ACCEPTED', 'NOTE_COMMENT', 'NOTE_LIKE', 'SYSTEM') NOT NULL COMMENT '通知类型',
    title VARCHAR(200) NOT NULL COMMENT '通知标题',
    content TEXT COMMENT '通知内容',
    related_id BIGINT COMMENT '相关对象ID(如好友申请ID、笔记ID等)',
    is_read BOOLEAN DEFAULT FALSE COMMENT '是否已读',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_is_read (is_read),
    INDEX idx_created_at (created_at)
) COMMENT '系统通知表';

-- 25. AI对话记录表
CREATE TABLE ai_conversations (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    note_id BIGINT COMMENT '关联的笔记ID',
    conversation_title VARCHAR(200) COMMENT '对话标题',
    conversation_type ENUM('NOTE_ANALYSIS', 'CONTENT_GENERATION', 'SMART_EDITING', 'QA_CHAT') DEFAULT 'QA_CHAT' COMMENT '对话类型',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_note_id (note_id),
    INDEX idx_conversation_type (conversation_type)
) COMMENT 'AI对话记录表';

-- 26. AI对话消息表
CREATE TABLE ai_messages (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    conversation_id BIGINT NOT NULL,
    role ENUM('USER', 'ASSISTANT', 'SYSTEM') NOT NULL COMMENT '消息角色',
    content LONGTEXT NOT NULL COMMENT '消息内容',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversation_id) REFERENCES ai_conversations(id) ON DELETE CASCADE,
    INDEX idx_conversation_id (conversation_id),
    INDEX idx_created_at (created_at)
) COMMENT 'AI对话消息表';

-- 27. 用户活动日志表
CREATE TABLE user_activity_logs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    action_type VARCHAR(50) NOT NULL COMMENT '操作类型',
    resource_type VARCHAR(50) COMMENT '资源类型(note, question, etc.)',
    resource_id BIGINT COMMENT '资源ID',
    description TEXT COMMENT '操作描述',
    ip_address VARCHAR(45) COMMENT 'IP地址',
    user_agent TEXT COMMENT '用户代理',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_action_type (action_type),
    INDEX idx_created_at (created_at)
) COMMENT '用户活动日志表';

