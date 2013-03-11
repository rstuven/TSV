(function(){

    var br = "\n"

    function stringify (data) {
        var sep    = this.sep
          , keys   = (typeof data[0] === 'object') && Object.keys(data[0])
          , header = keys && keys.join(sep)
          , output = header + br

        if (!keys) return ''
            
        return output + data.map(function(obj){
            var values = keys.reduce(function(p, key){
                p.push(obj[key])
                return p
            }, [])
            return values.join(sep)
        }).join(br)
    }

    function comments (line) {
        return !/#@/.test(line[0])
    }

    function parse (tsv, opts) {
        var sep   = this.sep
          , lines = tsv.split(/[\n\r]/).filter(comments)
          , keys  = lines.shift().split(sep)
          , json  = opts && opts.json

        if (lines.length < 1) return []

        return lines.reduce(function(p, line){
            p.push(line.split(sep).reduce(function(p, val, i){
                p[keys[i]] = json ? JSON.parse(val) : val
                return p
            }, {}))
            return p
        }, [])
    }

    var TSV = {
        stringify: stringify
      , parse: parse
      , sep: "\t"
    }

    // cyclical reference to allow both
    //   var TSV = require('tsv')
    // and
    //   { TSV, CSV } = require('tsv')
    TSV.TSV = TSV

    TSV.CSV = {
        stringify: stringify
      , parse: parse
      , sep: ","
    }

    if (typeof module !== 'undefined' && module.exports){
        module.exports = TSV
    } else {
        this.TSV = TSV
    }

}).call(this)
