import { Schema } from 'koishi'

export interface Config {
    isR18: boolean
    r18P: number
    excludeAI: boolean
    isProxy: boolean
    proxyHost: string
    baseUrl: string
    imageConfusion: boolean
    maxConcurrency: number
    forwardMessage: boolean
    compress: boolean
    defaultSourceProvider: 'none' | 'lolicon' | 'lolisuki' | 'pixiv-discovery' | 'pixiv-following'
    isLog: boolean
    pixiv: {
        phpSESSID: string
        following: {
            userId: string
            offset: number
            limit: number
        }
    }
}

export const Config: Schema<Config> = Schema.intersect([
    // 通用设置
    Schema.object({
        isR18: Schema.boolean()
            .default(false)
            .description('是否允许返回 R18 内容。'),

        excludeAI: Schema.boolean()
            .default(false)
            .description('是否排除 AI 生成作品。'),

        imageConfusion: Schema.boolean()
            .default(false)
            .description('是否启用图片混淆处理。（对某些平台有奇效）'),

        maxConcurrency: Schema.number()
            .default(1)
            .description('最大并发请求数。')
            .min(1)
            .max(10)
            .step(1),

        forwardMessage: Schema.boolean()
            .default(true)
            .description('是否以转发消息格式发送图片。'),

        compress: Schema.boolean()
            .default(false)
            .description('是否压缩图片（能大幅度提升发送的速度，但是对图片质量有影响）')
    }).description('通用设置'),

    // R18 内容设置
    Schema.object({
        isR18: Schema.const(true),
        r18P: Schema.percent()
            .default(0.1)
            .description('R18 内容出现的概率。')
            .min(0)
            .max(1)
            .step(0.01)
    }).description('R18 内容设置'),

    // 代理设置
    Schema.object({
        isProxy: Schema.boolean().default(false).description('是否使用代理。'),
        proxyHost: Schema.string()
            .default('http://127.0.0.1:7890')
            .description('代理服务器地址。'),
        baseUrl: Schema.string()
            .default('i.pixiv.re')
            .description('图片反代服务的地址。')
    }).description('代理设置'),

    // 图源设置
    Schema.object({
        defaultSourceProvider: Schema.union([
            Schema.const('none').description('无'),
            Schema.const('lolicon').description('Lolicon API'),
            Schema.const('lolisuki').description('Lolisuki API'),
            Schema.const('pixiv-discovery').description('Pixiv Discovery'),
            Schema.const('pixiv-following').description('Pixiv Following')
        ])
            .description('选择默认图片来源')
            .default('lolicon')
    }).description('图源设置'),

    // Pixiv 设置
    Schema.object({
        pixiv: Schema.object({
            phpSESSID: Schema.string()
                .description('Pixiv 的 PHPSESSID，用于访问个性化内容。返回的图片分级取决于该 Pixiv 账号所有者的分级设置。')
                .default(''),
            following: Schema.object({
                userId: Schema.string()
                    .description('Pixiv 用户 ID，用于获取关注列表')
                    .default(''),
                offset: Schema.number()
                    .description('关注列表的偏移量')
                    .default(0)
                    .min(0),
                limit: Schema.number()
                    .description('获取关注列表的数量限制')
                    .default(10)
                    .min(1)
                    .max(100)
            }).description('Pixiv Following 设置')
        }).description('Pixiv 设置')
    }),

    Schema.object({
        isLog: Schema.boolean().default(false).description('是否输出debug日志')
    }).description('日志设置')
])

export const name = 'pixluna'

export default Config
