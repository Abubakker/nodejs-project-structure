const Controller = loadCore('controller');
module.exports = class home extends Controller {

    constructor() {
        super();
    }

    index(Req, Res) {
        ApiErrorResponse(Res, 'FORBIDDEN');
    }
    console(Req,Res){
        Res.render('console/index');
    }
}


