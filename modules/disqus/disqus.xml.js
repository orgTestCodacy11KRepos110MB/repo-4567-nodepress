"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDisqusXML = void 0;
const moment_1 = __importDefault(require("moment"));
const biz_interface_1 = require("../../interfaces/biz.interface");
const urlmap_transformer_1 = require("../../transformers/urlmap.transformer");
const disqus_constant_1 = require("./disqus.constant");
const disqus_model_1 = require("./disqus.model");
const app_config_1 = require("../../app.config");
const getCommentItemXML = (comment) => {
    return `
    <wp:comment>
      <wp:comment_id>${comment.id}</wp:comment_id>
      <wp:comment_parent>${comment.pid || ''}</wp:comment_parent>
      <wp:comment_author>${comment.author.name || ''}</wp:comment_author>
      <wp:comment_author_email>${comment.author.email || ''}</wp:comment_author_email>
      <wp:comment_author_url>${comment.author.site || ''}</wp:comment_author_url>
      <wp:comment_author_IP>${comment.ip || ''}</wp:comment_author_IP>
      <wp:comment_date_gmt>${(0, moment_1.default)(comment.create_at).format('YYYY-MM-DD HH:mm:ss')}</wp:comment_date_gmt>
      <wp:comment_content><![CDATA[${comment.content || ''}]]></wp:comment_content>
      <wp:comment_approved>${comment.state === biz_interface_1.CommentState.Published ? 1 : 0}</wp:comment_approved>
    </wp:comment>
  `;
};
const getDisqusXML = (data, guestbook) => {
    return `<?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0"
      xmlns:content="http://purl.org/rss/1.0/modules/content/"
      xmlns:dsq="http://www.disqus.com/"
      xmlns:dc="http://purl.org/dc/elements/1.1/"
      xmlns:wp="http://wordpress.org/export/1.0/"
    >
      <channel>
        <item>
          <title>Guestbook</title>
          <link>${(0, urlmap_transformer_1.getPermalinkByID)(biz_interface_1.CommentPostID.Guestbook)}</link>
          <content:encoded><![CDATA[${app_config_1.APP.FE_NAME}]]></content:encoded>
          <dsq:thread_identifier>${(0, disqus_constant_1.getThreadIdentifierByID)(biz_interface_1.CommentPostID.Guestbook)}</dsq:thread_identifier>
          <wp:post_date_gmt>2017-01-01 00:00:00</wp:post_date_gmt>
          <wp:comment_status>open</wp:comment_status>
          ${guestbook.map(getCommentItemXML).join('\n')}
        </item>
        ${data
        .map((item) => `
            <item>
              <title>${item.article.title}</title>
              <link>${(0, urlmap_transformer_1.getPermalinkByID)(item.article.id)}</link>
              <content:encoded><![CDATA[${item.article.description || ''}]]></content:encoded>
              <dsq:thread_identifier>${(0, disqus_constant_1.getThreadIdentifierByID)(item.article.id)}</dsq:thread_identifier>
              <wp:post_date_gmt>${(0, moment_1.default)(item.article.create_at).format('YYYY-MM-DD HH:mm:ss')}</wp:post_date_gmt>
              <wp:comment_status>${item.article.disabled_comment ? disqus_model_1.ThreadState.Closed : disqus_model_1.ThreadState.Open}</wp:comment_status>
              ${item.comments.map(getCommentItemXML).join('\n')}
            </item>
          `)
        .join('\n')}
      </channel>
    </rss>`;
};
exports.getDisqusXML = getDisqusXML;
//# sourceMappingURL=disqus.xml.js.map