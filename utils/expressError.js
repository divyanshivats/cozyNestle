class expressError extends Error{
    constructor(status, msg){
        super();
        this.status = status;
       
    }
}
module.exports = expressError;