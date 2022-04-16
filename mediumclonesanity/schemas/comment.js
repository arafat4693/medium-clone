export default {
    name: 'comment',
    title: 'Comment',
    type: 'document',
    fields: [
        {
            name: 'name',
            title: 'Name',
            type: 'string',
        },
        {
            name: 'mail',
            title: 'Mail',
            type: 'string',
        },
        {
            name: 'post',
            title: 'Post',
            type: 'reference',
            to: [{ type: 'post' }],
        },
        {
            name: 'comment',
            title: 'Comment',
            type: 'text'
        },
        {
            name: 'approved',
            title: 'Approved',
            type: 'boolean'
        },
    ]
}
