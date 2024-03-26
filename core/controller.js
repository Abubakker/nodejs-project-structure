/*
 @ title: Master controller of the project
 @ Purpose: Common method which needs in all controller develop here
 @ Use: Every controller should child of this controller
*/
class controller {

    constructor() {
        this.data = {
            'page_title': 'NodeJs-Boilerplate'
        };
    }
    notFound(Req, Res) {
        if (Req.xhr || Req.originalUrl.includes('/api/')) {
            return Res.send({
                'error': 1,
                'error_code': 'NOT_FOUND',
                'message': 'The requested URL/Page was not found'
            });
        }
        return Res.render('errors/404');
    }
}

module.exports = controller;