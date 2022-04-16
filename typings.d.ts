export interface Post {
    _id: string;
    _createdAt: string;
    title: string;
    comments: Comment[];
    author: {
        name: string;
        image: string;
    }
    description: string;
    mainImage: {
        asset: {
            url: string;
        }
    }
    slug: {
        current: string;
    }
    body: [object]
}

export interface Comment {
    _id: string;
    _createdAt: string;
    approved: boolean;
    comment: string;
    mail: string;
    name: string;
    post: {
        _ref: string;
        _type: string;
    },
    _rev: string;
    _type: string;
    _updatedAt: string;
}