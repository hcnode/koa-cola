declare module NodeJS  {
    interface Global {
        app: any
        navigator : any
        window : any
        document : any
        $ : any
        documentRef : any
        globalConfig : any
    }
}
declare var app : any
declare var require: NodeRequire;
declare var globalConfig : any