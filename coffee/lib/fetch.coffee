get = ( path ) -> new Promise ( done ) =>
    fetch( path )
        .then( (t) => t.text() )
        .then( (s) => done(s) )

export {
    get
}