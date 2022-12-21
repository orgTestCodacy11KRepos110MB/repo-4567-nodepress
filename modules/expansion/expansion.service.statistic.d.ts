import { CacheService } from '@app/processors/cache/cache.service';
import { ArticleService } from '@app/modules/article/article.service';
import { CommentService } from '@app/modules/comment/comment.service';
import { FeedbackService } from '@app/modules/feedback/feedback.service';
import { TagService } from '@app/modules/tag/tag.service';
declare const DEFAULT_STATISTIC: Readonly<{
    tags: null;
    articles: null;
    comments: null;
    totalViews: null;
    totalLikes: null;
    todayViews: null;
    averageEmotion: null;
}>;
export type Statistic = Record<keyof typeof DEFAULT_STATISTIC, number | null>;
export declare class StatisticService {
    private readonly cacheService;
    private readonly articleService;
    private readonly commentService;
    private readonly feedbackService;
    private readonly tagService;
    constructor(cacheService: CacheService, articleService: ArticleService, commentService: CommentService, feedbackService: FeedbackService, tagService: TagService);
    getStatistic(publicOnly: boolean): Promise<Statistic>;
}
export {};
