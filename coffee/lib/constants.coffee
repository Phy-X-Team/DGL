export default new Proxy({}, {
    get : ( o, key ) ->
        sum = 0
        sum = sum + c.charCodeAt(0) for c in key
        sum
})