var url = require('url');
var Stremio = require("stremio-addons");
var magnet = require("magnet-uri");
const fs = require("fs");
const cheerio = require('cheerio');
var sqlite = require('sqlite-sync');
sqlite.connect('linhas.sqlite3');
var request = require('sync-request');
var express = require('express');
var ourImdbIds2 = "";
var ourImdbIds3 = [];
/*
 cd C:\Users\Mateus\Dropbox\Aplicativos\Heroku\stremiodublado
 git add .
 git commit -am "make it better"
 git push heroku master
 */
//carregar ("http://hidratorrent.com/dragon-ball-super-3-temporada-completa-torrent");

process.env.STREMIO_LOGGING = true; // enable server logging for development purposes

var localtunnel = require('localtunnel');

var tunnel = localtunnel(7000,{subdomain:'stremiodub'}, function(err, tunnel) {
    l(tunnel.url);
});

var manifest = {
    "id": "org.stremio.helloworld",
    "version": "1.0.6",

    "name": "Filmes e Séries Dublados",
    "description": "Filmes e Séries Dublados",
    endpoint: "http://localhost:7000/stremio/v1",

    // Properties that determine when Stremio picks this add-on
    "types": ["movie", "series"], // your add-on will be preferred for those content types
    "idProperty": "imdb_id", // the property to use as an ID for your add-on; your add-on will be preferred for items with that property; can be an array
    // We need this for pre-4.0 Stremio, it's the obsolete equivalent of types/idProperty
    "filter": {"query.imdb_id": {"$exists": true}, "query.type": {"$in": ["series", "movie"]}}
};

var methods = {};

// To provide meta for our movies, we'll just proxy the official cinemeta add-on
var client = new Stremio.Client();
client.add("http://cinemeta.strem.io/stremioget/stremio/v1");

// Proxy Cinemeta, but get only our movies
// That way we get a tab "Hello World" with the movies we provide :) 
methods["meta.find"] = function (args, callback) {

    //console.log(args);

    var object;
    if (args.sort['2018-2019'] == -1) {

        object = {complete: true, query: {year: [2018, 2019], type: args.query.type}, limit: 500, skip: args.skip};
        client.meta.find(object, function (err, res) {
            if (err)
                console.error(err);

            console.log(res.length);
            var novo_res = [];
            res.forEach(function (key) {

                if (ourImdbIds3.indexOf(key.imdb_id) > 0) {
                    novo_res.push(key);
                }
            });
            res = novo_res;

            res = res.sort(function (a, b) {
                if (res[0].type == 'series') {
                    return b.year.split('–')[0] - a.year.split('–')[0];
                } else {
                    return b.year - a.year;
                }
            });

            callback(err, res ? res.map(function (r) {
                return r;
            }) : null);
        });
    }
    if (args.sort['2016-2017'] == -1) {

        object = {complete: true, query: {year: [2016, 2017], type: args.query.type}, limit: 500, skip: args.skip};
        client.meta.find(object, function (err, res) {
            if (err)
                console.error(err);

            console.log(res.length);
            var novo_res = [];
            res.forEach(function (key) {

                if (ourImdbIds3.indexOf(key.imdb_id) > 0) {
                    novo_res.push(key);
                }
            });
            res = novo_res;

            res = res.sort(function (a, b) {
                if (res[0].type == 'series') {
                    return b.year.split('–')[0] - a.year.split('–')[0];
                } else {
                    return b.year - a.year;
                }
            });

            callback(err, res ? res.map(function (r) {
                return r;
            }) : null);
        });
    }
    if (args.sort['2014-2015'] == -1) {

        object = {complete: true, query: {year: [2014, 2015], type: args.query.type}, limit: 500, skip: args.skip};
        client.meta.find(object, function (err, res) {
            if (err)
                console.error(err);

            console.log(res.length);
            var novo_res = [];
            res.forEach(function (key) {

                if (ourImdbIds3.indexOf(key.imdb_id) > 0) {
                    novo_res.push(key);
                }
            });
            res = novo_res;

            res = res.sort(function (a, b) {
                if (res[0].type == 'series') {
                    return b.year.split('–')[0] - a.year.split('–')[0];
                } else {
                    return b.year - a.year;
                }
            });

            callback(err, res ? res.map(function (r) {
                return r;
            }) : null);
        });
    }
    if (args.sort['2005-2013'] == -1) {

        object = {complete: true, query: {year: [2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013], type: args.query.type}, limit: 500, skip: args.skip};
        client.meta.find(object, function (err, res) {
            if (err)
                console.error(err);

            console.log(res.length);
            var novo_res = [];
            res.forEach(function (key) {

                if (ourImdbIds3.indexOf(key.imdb_id) > 0) {
                    novo_res.push(key);
                }
            });
            res = novo_res;

            res = res.sort(function (a, b) {
                if (res[0].type == 'series') {
                    return b.year.split('–')[0] - a.year.split('–')[0];
                } else {
                    return b.year - a.year;
                }
            });

            callback(err, res ? res.map(function (r) {
                return r;
            }) : null);
        });
    }

}


// utility function to add from magnet

function fromMagnetMap(uri, m, nome) {
    //console.log(uri);
    var parsed = magnet.decode(uri);
    // console.log(uri);
    var infoHash = parsed.infoHash.toLowerCase();
    nome = nome.toUpperCase();

    var tags = "";
    if (nome.match(/720P/i))
        tags = tags + ("720p ");
    if (nome.match(/1080P/i))
        tags = tags + ("1080p ");
    if (nome.match(/LEGENDADO/i))
        tags = tags + ("LEGENDADO ");
    if (nome.match(/DUBLADO/i))
        tags = tags + ("DUBLADO ");
    if (nome.match(/DUBLADA/i))
        tags = tags + ("DUBLADA ");
    if (nome.match(/DUAL/i))
        tags = tags + ("DUAL ÁUDIO ");
    if (nome.match(/4K/i))
        tags = tags + ("4K ");
    if (nome.match(/2160P/i))
        tags = tags + ("2160p ");
    if (nome.match(/UHD/i))
        tags = tags + ("UHD ");

    return {
        infoHash: infoHash,
        sources: (parsed.announce || []).map(function (x) {
            return "tracker:" + x
        }).concat(["dht:" + infoHash]),
        tag: tags,
        title: tags,
        mapIdx: m,
        nome: nome
    }
}

var addon = new Stremio.Server(methods, manifest);


if (module.parent) {
    module.exports = addon;
} else {
    var server = require("http").createServer(function (req, res) {

        var q = url.parse(req.url, true);
        var qdata = q.query;
        var urll = q.pathname;
        var query = qdata;

        addon.middleware(req, res, function () {
            res.end();
        });

        if (urll == "/comando") {
            /*res.set('Content-Type', 'text/html');
             res.end("\
             Comandos: <br>\n\
             /lista?q=http://hidratorrent.com/maisbaixados-filmes<br>\n\
             /lista?q=http://hidratorrent.com/lancamentos-filmes<br>\n\
             /lista?q=https://ondeeubaixo.com.br/lancamentos-filmes<br>\n\
             /buscarHidra?q=creed<br>\n\
             /lancamentosHidra<br>\n\
             /lancamentosOndeEuBaixo<br>\n\
             /link?q=http://hidratorrent.com/cacadora-de-gigantes-torrent<br>\n\
             /link?i=tt3007640&q=https://www.baixarfilmetorrent.net/largados-e-pelados-3a-temporada-completa-torrent-dublada-e-legendada/<br>\n\
             <br><br><br>\n\
             URL: <input type='text' id='texto'><br>\n\
             IMDB:  <input type='text' id='imdb'><br><br>\n\
             <a href onclick=\"window.open('/lista?q='+document.getElementById('texto').value, '_blank');\" >Carregar Lista</a><br>\n\
             <a href onclick=\"window.open('/buscarHidra?q='+document.getElementById('texto').value, '_blank');\" >Carregar Busca</a><br>\n\
             <a href onclick=\"window.open('/lancamentosHidra', '_blank');\" >Carregar Lançamentos</a><br>\n\
             <a href onclick=\"window.open('/link?q='+document.getElementById('texto').value, '_blank');\" >Carregar Link</a><br>\n\
             <a href onclick=\"window.open('/link?i='+document.getElementById('imdb').value+'&q='+document.getElementById('texto').value, '_blank');\" >Carregar Link + IMDB</a><br>\n\
             <br><br>\n\
             <a href='https://dashboard.heroku.com/apps/nodestremio/logs' target='_blank'>Log</a><br>\n\
             <br>\n\
             */
            // res.send('');
        }
        if (urll == "/buscarHidra") {

            dataset = [];
            dataset_links = [];
            dataset_hashs = [];
            dataset_links.push(["Tipo", "Link"]);
            dataset_hashs.push(["hash", "magnet", "imdb", "img"]);
            console.log(query.q);
            carregarBusca(query.q);

        }
        if (url == "/lista") {

            dataset = [];
            dataset_links = [];
            dataset_hashs = [];
            dataset_links.push(["Tipo", "Link"]);
            dataset_hashs.push(["hash", "magnet", "imdb", "img"]);
            console.log(query.q);
            lista(query.q + "-", 1, 3);

        }
        if (urll == "/link") {

            dataset = [];
            dataset_links = [];
            dataset_hashs = [];
            dataset_links.push(["Tipo", "Link"]);
            dataset_hashs.push(["hash", "magnet", "imdb", "img"]);
            console.log(query.q);
            dataset_links.push(query.q);
            var im = query.i;
            if (im) {
                retorno_carregar_links_imdb(im);
            } else {
                retorno_carregar_links();
            }
            retorno_carregar_hashs();
            append_dataset();
        }
        if (urll == "/lancamentosHidra") {

            dataset = [];
            dataset_links = [];
            dataset_hashs = [];
            dataset_links.push(["Tipo", "Link"]);
            dataset_hashs.push(["hash", "magnet", "imdb", "img"]);

            l('Lançamentos');
            lista("http://hidratorrent.com/lancamentos-", 1, 3);

        }
        if (urll == "/lancamentosOndeEuBaixo") {

            dataset = [];
            dataset_links = [];
            dataset_hashs = [];
            dataset_links.push(["Tipo", "Link"]);
            dataset_hashs.push(["hash", "magnet", "imdb", "img"]);
            l('Lançamentos');
            lista("https://ondeeubaixo.com.br/lancamentos-", 1, 3);


        }

    }).on("listening", function ()
    {
        console.log(server.address());

    }).listen(7000);

}



// Streaming
methods["stream.find"] = function (args, callback) {
    if (!args.query) {
        return callback();
    }
    //callback(null, [dataset[args.query.imdb_id]]); // Works only for movies
    //console.log('teste2');
    var key = [args.query.imdb_id, args.query.season, args.query.episode].filter(function (x) {
        return x
    }).join(" ");

    console.log("SELECT * FROM registros where imdb='" + key + "'");
    sqlite.runAsync("SELECT * FROM registros where imdb='" + key + "'", function (rows) {
        var dataset_temp = [];

        if (rows != null) {
            rows.forEach(function (row) {
                try {
                    if (dataset_temp != null) {
                        if (dataset_temp.indexOf(fromMagnetMap(row.magnet, row.mapa, row.nome)) > -1) {
                            console.log("Existe:", row.nome);
                        } else {
                            dataset_temp.push(fromMagnetMap(row.magnet, row.mapa, row.nome));
                        }
                    } else {
                        dataset_temp = [fromMagnetMap(row.magnet, row.mapa, row.nome)];
                    }
                } catch (e) {
                }

            });
        }
        callback(null, dataset_temp);
    });

    //console.log(key, args.query.imdb_id, args.query.season, args.query.episode);
    //console.log(dataset);
    //console.log(dataset['tt6343314']);

};

// Add sorts to manifest, which will add our own tab in sorts 2005-20131980-2004
manifest.sorts = [
    {prop: "2018-2019", name: "2018-2019", types: ["movie"]},
    {prop: "2016-2017", name: "2016-2017", types: ["movie"]},
    {prop: "2014-2015", name: "2014-2015", types: ["movie"]},
    {prop: "2005-2013", name: "2005-2013", types: ["movie"]}];


function ler(arq) {

    var linhas = arq.split("\n");
    console.log("Linhas:", linhas.length);
    var dataset_temp = new Object();
    for (i = 1; i < linhas.length; i++) {
        var campos = linhas[i].split("\t");
        //console.log(campos);
        var id2 = campos[1];
        var mag = campos[2];
        var map = campos[3];
        var nome = campos[4];


        try {
            if (dataset_temp[id2] != null) {

                if (dataset_temp[id2].indexOf(fromMagnetMap(mag, map, nome)) > -1) {
                    console.log("Existe:", nome);
                } else {
                    dataset_temp[id2].push(fromMagnetMap(mag, map, nome));
                }
            } else {
                dataset_temp[id2] = [fromMagnetMap(mag, map, nome)];
            }
        } catch (e) {

        }
    }

    Object.keys(dataset_temp).forEach(function (key) {

        var k = key.split(" ")[0];

        if (ourImdbIds2.indexOf(k) == -1) {
            ourImdbIds2 += k + ",";
            //if (ourImdbIds3.length < 480)
            ourImdbIds3.push(k);

        } else {
// console.log(k);
        }
    });
    console.log("Títulos:", ourImdbIds3.length);

    console.log("Títulos:", ourImdbIds3[0]);

    ourImdbIds3 = ourImdbIds3.sort(function (a, b) {
        return b.localeCompare(a);
    });
    console.log("Títulos:", ourImdbIds3[0]);



}









var dataset = [];
var dataset_links = [];
var dataset_hashs = [];
//dataset.push(["Tipo","IMDB","Magnet","Map","Arquivo","Título", "Seed", "Imagem"]);
dataset_links.push(["Tipo", "Link"]);
dataset_hashs.push(["hash", "magnet", "imdb", "img"]);

function append_dataset() {
    l('append_dataset');
    //DELETE FROM registros WHERE id NOT IN (SELECT min(id) FROM registros GROUP BY imdb, magnet, mapa);

    dataset.forEach(function (v) {
        var campos = v;
        //console.log(campos);
        var imdb = campos[1];
        var mag = campos[2];
        var map = campos[3];
        var nome = campos[4];
        sqlite.run("INSERT INTO registros VALUES (null,'" + imdb + "','" + mag + "','" + map + "','" + nome + "')");


    });

    sqlite.run('DELETE FROM registros WHERE id NOT IN (SELECT min(id) FROM registros GROUP BY imdb, magnet, mapa)');
    console.log("Fim");


}


function carregarBusca(busca) {

    var p = "https://hidratorrent.com/torrent-" + busca + "/1";
    l(p);
    var res = request('GET', p);
    var data = res.getBody('utf8');
    carregar_links(data);
    retorno_carregar_links();
    retorno_carregar_hashs();
    append_dataset();


}

function lista(tipo, ini, tamanho) {

    for (i = ini; i < (ini + tamanho); i++) {

        var p = tipo + i;
        l(p);
        var res = request('GET', p);
        var data = res.getBody('utf8');
        carregar_links(data);
    }
    retorno_carregar_links();
    retorno_carregar_hashs();
    append_dataset();


}
function carregar_links(data) {

//append(data[1]);

    const $ = cheerio.load(data);

    var titulos = $('.list-inline > li');

    titulos.each(function (index, elem) {

        var link = $(this).find('a')[0].attribs.href;
        var dublado = $(this).find('.idioma_lista').text().trim();

        if (dublado == "Dublado") {
            l(link);
            dataset_links.push(link);
        }
    });
}
function retorno_carregar_links() {

    l('retorno_carregar_links');
    for (var n = 1; n < dataset_links.length; n++) {

        var p = dataset_links[n];
        var res = request('GET', p);
        const $ = cheerio.load(res.getBody('utf8'));
        var id_imdb = "";
        try {
            id_imdb = $("a[href*='www.imdb.com']").get(0).attribs.href;
            id_imdb = id_imdb.replace("http://www.imdb.com/title/", "").replace("https://www.imdb.com/title/", "").replace("/", "").replace("/", "").replace("?ref_=nv_sr_", "").replace("?ref_=plg_rt_1", "").replace("http:www.imdb.com", "").trim();
        } catch (e) {
        }

        l('IMDB:' + id_imdb);
        $("a[href*='magnet:?xt=urn']").each(function (index, elem) {

            var title = this.attribs.title;
            var mag = this.attribs.href;
            var index = mag.indexOf('&');
            var info;
            if (index > 0) {
                info = mag.substring(19 + 1, mag.indexOf('&')).toLowerCase();
            } else {
                info = mag.substring(19 + 1).toLowerCase();
            }
            if (title) {
                if (title.toLowerCase().indexOf('legendado') > 0) {

                } else {
                    dataset_hashs.push([info, mag, id_imdb, "", "", title]);
                }
            } else {
                dataset_hashs.push([info, mag, id_imdb, "", "", ""]);
            }

        });
    }



}
function retorno_carregar_links_imdb(im) {

    l('retorno_carregar_links_imdb');
    for (var n = 1; n < dataset_links.length; n++) {

        var p = dataset_links[n];
        var res = request('GET', p);
        const $ = cheerio.load(res.getBody('utf8'));
        var id_imdb = im;

        l('IMDB:' + id_imdb);
        $("a[href*='magnet:?xt=urn']").each(function (index, elem) {

            var title = this.attribs.title;
            var mag = this.attribs.href;
            var index = mag.indexOf('&');
            var info;
            if (index > 0) {
                info = mag.substring(19 + 1, mag.indexOf('&')).toLowerCase();
            } else {
                info = mag.substring(19 + 1).toLowerCase();
            }
            if (title) {
                if (title.toLowerCase().indexOf('legendado') > 0) {

                } else {
                    dataset_hashs.push([info, mag, id_imdb, "", "", title]);
                }
            } else {
                dataset_hashs.push([info, mag, id_imdb, "", "", ""]);
            }

        });
    }



}
function retorno_carregar_hashs() {

    l('retorno_carregar_hashs');
    for (i1 = 1; i1 < dataset_hashs.length; i1++) {

        var r = dataset_hashs[i1];
        var p = "https://www.skytorrents.lol/torrent/" + r[0];
        l(p);
        var res = request('GET', p);
        r[4] = res.getBody('utf8');
        carregar_dados_imdb(r);
    }
}
function carregar_dados_imdb(data) {
    if (data[2].length == 0) {
        const $ = cheerio.load(data[4]);
        var title = $('title').text().toLowerCase().trim().replace("temporada", "").replace("720p", "").replace("dublado", "").replace("filmes beta", "").replace("sky torrents", "").replace("-", "").replace("-", "").trim();

        var p = "https://www.imdb.com/find?ref_=nv_sr_fn&q=" + title + "&s=all";
        l(p);
        var res = request('GET', p);
        const jquery = cheerio.load(res.getBody('utf8'));
        var retorno = jquery('.result_text > a').get(0);
        if (retorno) {
            retorno = retorno.attribs.href.replace('https://www.imdb.com/title/', '').replace('/?ref_=fn_al_tt_1', '').replace('/title/', '');
            data[2] = retorno;
            console.log(retorno);
        }
    }
    carregar_dados_torrent(data);

}
function carregar_dados_torrent(data) {
    l('carregar_dados_torrent');
    const $ = cheerio.load(data[4]);
    var title = $('title').text().toLowerCase().trim().replace("temporada", "").replace("720p", "").replace("dublado", "").replace("filmes beta", "").replace("sky torrents", "").replace("-", "").trim();

    //l(['Titulo', data[0], data[5], title]);
    var arquivos = $('.column.is-8.has-text-centered > div > div > table > tbody > tr');
    var id_imdb = data[2];

    if (data[0] == '454786f84767a297e3c16bcb40c8922712bdb937') {
        l("entrou");
        id_imdb = 'tt0182576';
    }

    if (id_imdb.length < 5) {
        try {
            id_imdb = $("a[href*='www.imdb.com']").get(0).attribs.href;
            id_imdb = id_imdb.replace("http://www.imdb.com/title/", "").replace("https://www.imdb.com/title/", "").replace("/", "").replace("/", "").replace("?ref_=nv_sr_", "").replace("?ref_=plg_rt_1", "");
        } catch (e) {

        }
    }

    arquivos.each(function (index) {

        if (index > 0) {

            var ar = $($(this).children().get(0)).text();
            var tm = $($(this).children().get(1)).text();
            //l('IMDB:' + id_imdb + " " + ar.trim() + " " + tm.trim());
            var final = ar.toLowerCase().substring(ar.length, ar.length - 4);

            if (id_imdb.trim().length > 5 && ar.toLowerCase() != 'comandotorrents.com.mp4' && ar.toLowerCase() != 'bludv.com.mp4') {

                if (final != '.url' && final != '.txt' && final != '.inf' && final != '.srt' && final != '.ass' && final != '.crt' && ar.toLowerCase().indexOf('.bdmv') < 1 && ar.toLowerCase().indexOf('.m2ts') < 1 && ar.toLowerCase().indexOf('.mpls') < 1 && final != '.xml' && ar.toLowerCase().indexOf('.mpls') < 1 && ar.toLowerCase().indexOf('.properties') < 1 && final != '.jar' && ar.toLowerCase().indexOf('.clpi') < 1 && ar.toLowerCase().indexOf('.bdjo') < 1 && final != '.otf' && final != '.lst' && final != '.tbl' && final != '.cer' && final != '.rar') {

                    if (final != '.jpg' && final != '.png' && ar.toLowerCase() != 'bludv.mp4' && ar.toLowerCase() != 'lapumia.mp4') {

                        var temp = temporada(ar, "", title);
                        var eps = episodio(ar, "", title);
                        if (temp > 0 && eps > 0) {
                            var mag = data[1];
                            var id = id_imdb.trim() + " " + temp + " " + eps;
                            var img = data[3];
                            var map = index - 1;
                            var filme = [];
                            filme[0] = "Série";
                            filme[1] = id;
                            filme[2] = mag;
                            filme[3] = map;
                            filme[4] = ar.trim();
                            dataset.push(filme);
                            l("Episodio adicionado: E:" + eps + " T:" + temp + " " + title);
                            //append(mag, id, temp, eps, map, ar);
                            //append(JSON.stringify(fromMagnetMap(mag, index-1)));

                        } else {

                            var mag = data[1];
                            var id = id_imdb.trim();
                            var img = data[3];
                            var map = index - 1;
                            if (ar.toLowerCase().indexOf('temporada') < 1 && title.toLowerCase().indexOf('temporada') < 1) {

                                var filme = [];
                                filme[0] = "Filme";
                                filme[1] = id;
                                filme[2] = mag;
                                filme[3] = map;
                                filme[4] = ar.trim();
                                l("Filme adicionado: " + title);
                                dataset.push(filme);
                            }

                        }

                    }
                }
            }
        }
    });

}

function limpaTitulo(t) {

    t = t.toUpperCase();
    var a = "";
    for (i = 1950; i < 2020; i++) {

        a = "-" + i;
        t = t.replace(a, '');
        a = "" + i;
        t = t.replace(a, '');
    }
    for (i = 1; i < 20; i++) {

        a = "Parte." + i;
        t = t.replace(a, '');
        a = "Parte " + i;
        t = t.replace(a, '');
    }
    t = t.replace('720', '').replace('X264', '').replace('X265', '').replace('2160P', '').replace('4K', '').replace('4K', '');
    return t;
}

function temporada(t1, t2, t3) {

    t1 = limpaTitulo(t1);
    t2 = limpaTitulo(t2);
    t3 = limpaTitulo(t3);
    // append(t1, t3);

    var tempo = "";
    var ten;
    if (ten == null) {
        ten = t1.match(/S\d\d/g); //Temp 02 -
    }
    if (ten == null) {
        ten = t2.match(/S\d\d/g); //Temp 02 -
    }
    if (ten == null) {
        ten = t3.match(/S\d\d/g); //Temp 02 -
    }

    if (ten == null) {
        ten = t1.match(/\.S\d/g); //Temp 02 -
    }
    if (ten == null) {
        ten = t2.match(/\.S\d/g); //Temp 02 -
    }
    if (ten == null) {
        ten = t3.match(/\.S\d/g); //Temp 02 -
    }

    if (ten == null) {
        ten = t1.match(/T\d\d/g); //T02 -
    }
    if (ten == null) {
        ten = t2.match(/T\d\d/g); //T02 -
    }
    if (ten == null) {
        ten = t3.match(/T\d\d/g); //T02 -
    }


    if (ten == null) {
        ten = t1.match(/TEMP \d\d -/g); //Temp 02 -
    }
    if (ten == null) {
        ten = t2.match(/TEMP \d\d -/g); //Temp 02 -
    }
    if (ten == null) {
        ten = t3.match(/TEMP \d\d -/g); //Temp 02 -
    }

    if (ten == null) {
        ten = t1.match(/\d\dª TEMPORADA/g); //10ª TEMPORADA
    }
    if (ten == null) {
        ten = t2.match(/\d\dª TEMPORADA/g); //10ª TEMPORADA
    }
    if (ten == null) {
        ten = t3.match(/\d\dª TEMPORADA/g); //10ª TEMPORADA
    }

    if (ten == null) {
        ten = t1.match(/\d\d° TEMPORADA/g); //10ª TEMPORADA
    }
    if (ten == null) {
        ten = t2.match(/\d\d° TEMPORADA/g); //10ª TEMPORADA
    }
    if (ten == null) {
        ten = t3.match(/\d\d° TEMPORADA/g); //10ª TEMPORADA
    }

    if (ten == null) {
        ten = t1.match(/\d° TEMPORADA/g); //10ª TEMPORADA
    }
    if (ten == null) {
        ten = t2.match(/\d° TEMPORADA/g); //10ª TEMPORADA
    }
    if (ten == null) {
        ten = t3.match(/\d° TEMPORADA/g); //10ª TEMPORADA
    }


    if (ten == null) {
        ten = t1.match(/\d\dº TEMPORADA/g); //10ª TEMPORADA
    }
    if (ten == null) {
        ten = t2.match(/\d\dº TEMPORADA/g); //10ª TEMPORADA
    }
    if (ten == null) {
        ten = t3.match(/\d\dº TEMPORADA/g); //10ª TEMPORADA
    }

    if (ten == null) {
        ten = t1.match(/\dº TEMPORADA/g); //10ª TEMPORADA
    }
    if (ten == null) {
        ten = t2.match(/\dº TEMPORADA/g); //10ª TEMPORADA
    }
    if (ten == null) {
        ten = t3.match(/\dº TEMPORADA/g); //10ª TEMPORADA
    }



    if (ten == null) {
        ten = t1.match(/ \d TEMPORADA/g); //10ª TEMPORADA
    }
    if (ten == null) {
        ten = t2.match(/ \d TEMPORADA/g); //10ª TEMPORADA
    }
    if (ten == null) {
        ten = t3.match(/ \d TEMPORADA/g); //10ª TEMPORADA
    }


    if (ten == null) {
        ten = t1.match(/\d\d TEMPORADA/g); //10 TEMPORADA
    }
    if (ten == null) {
        ten = t2.match(/\d\d TEMPORADA/g); //10 TEMPORADA
    }
    if (ten == null) {
        ten = t3.match(/\d\d TEMPORADA/g); //10 TEMPORADA
    }

    if (ten == null) {
        ten = t1.match(/\d\d\.TEMPORADA/g); //10.TEMPORADA
    }
    if (ten == null) {
        ten = t2.match(/\d\d\.TEMPORADA/g); //10.TEMPORADA
    }
    if (ten == null) {
        ten = t3.match(/\d\d\.TEMPORADA/g); //10.TEMPORADA
    }

    if (ten == null) {
        ten = t1.match(/\dª TEMPORADA/g); //1ª TEMPORADA
    }
    if (ten == null) {
        ten = t2.match(/\dª TEMPORADA/g); //1ª TEMPORADA
    }
    if (ten == null) {
        ten = t3.match(/\dª TEMPORADA/g); //1ª TEMPORADA
    }

    if (ten == null) {
        ten = t1.match(/ \d\d-/g); //
    }
    if (ten == null) {
        ten = t2.match(/ \d\d-/g); //
    }
    if (ten == null) {
        ten = t3.match(/ \d\d-/g); //
    }

    if (ten == null) {
        ten = t1.match(/\.\d\dX/g); //
    }
    if (ten == null) {
        ten = t2.match(/\.\d\dX/g); //
    }
    if (ten == null) {
        ten = t3.match(/\.\d\dX/g); //
    }

    if (ten == null) {
        ten = t1.match(/- \dX/g); //
    }
    if (ten == null) {
        ten = t2.match(/- \dX/g); //
    }
    if (ten == null) {
        ten = t3.match(/\- dX/g); //
    }

    if (ten == null) {
        ten = t1.match(/-\dX/g); //
    }
    if (ten == null) {
        ten = t2.match(/-\dX/g); //
    }
    if (ten == null) {
        ten = t3.match(/\-dX/g); //
    }


    if (ten == null) {
        ten = t1.match(/\d\dX/g); //
    }
    if (ten == null) {
        ten = t2.match(/\d\dX/g); //
    }
    if (ten == null) {
        ten = t3.match(/\d\dX/g); //
    }

    if (ten == null) {
        ten = t1.match(/\.\dX/g); //
    }
    if (ten == null) {
        ten = t2.match(/\.\dX/g); //
    }
    if (ten == null) {
        ten = t3.match(/\.\dX/g); //
    }

    if (ten == null) {
        ten = t1.match(/\d\d\./g); //
    }
    if (ten == null) {
        ten = t2.match(/\d\d\./g); //
    }
    if (ten == null) {
        ten = t3.match(/\d\d\./g); //
    }

    if (ten == null) {
        ten = t1.match(/TEMPORADA \d/g); //Temp 02 -
    }
    if (ten == null) {
        ten = t2.match(/TEMPORADA \d/g); //Temp 02 -
    }
    if (ten == null) {
        ten = t3.match(/TEMPORADA \d/g); //Temp 02 -
    }


    if (ten != null) {
        tempo = ten[0];
        var tempo2 = tempo.replace('-', '').replace('TEMPORADA', '').replace('ª', '').replace(' ', '').replace('S', '').replace('TEMP', '').replace('T', '').replace('.', '').replace('X', '').replace('°', '').replace('º', '');
        tempo = tempo2 - 0;
        //append("T:"+tempo+" " + tempo2);        

    } else {

//append("Não Encontrado: " + t1 + " " + t2 + " " + t3+ " " + log);

    }
    return tempo;
}
function episodio(t1, t2, t3) {

    t1 = limpaTitulo(t1);
    t2 = limpaTitulo(t2);
    t3 = limpaTitulo(t3);
    var tempo = "";
    var ten;
    if (ten == null) {
        ten = t1.match(/EP\I \d\d/g); //Temp 02 -
    }
    if (ten == null) {
        ten = t2.match(/EP\I \d\d/g); //Temp 02 -
    }
    if (ten == null) {
        ten = t3.match(/EP\I \d\d/g); //Temp 02 -
    }


    if (ten == null) {
        ten = t1.match(/E\d\d/g); //Temp 02 -
    }
    if (ten == null) {
        ten = t2.match(/E\d\d/g); //Temp 02 -
    }
    if (ten == null) {
        ten = t3.match(/E\d\d/g); //Temp 02 -
    }

    if (ten == null) {
        ten = t1.match(/E\.\d\d\./g); //Temp 02 -
    }
    if (ten == null) {
        ten = t2.match(/E\.\d\d\./g); //Temp 02 -
    }
    if (ten == null) {
        ten = t3.match(/E\.\d\d\./g); //Temp 02 -
    }


    if (ten == null) {
        ten = t1.match(/\.\d\d\d\./g); //Temp 02 -
    }
    if (ten == null) {
        ten = t2.match(/\.\d\d\d\./g); //Temp 02 -
    }
    if (ten == null) {
        ten = t3.match(/E\.\d\d\./g); //Temp 02 -
    }

    if (ten == null) {
        ten = t1.match(/EP\d\d\d/g); //Temp 02 -
    }
    if (ten == null) {
        ten = t2.match(/EP\d\d\d/g); //Temp 02 -
    }
    if (ten == null) {
        ten = t3.match(/EP\d\d\d/g); //Temp 02 -
    }

    if (ten == null) {
        ten = t1.match(/EP\d\d/g); //Temp 02 -
    }
    if (ten == null) {
        ten = t2.match(/EP\d\d/g); //Temp 02 -
    }
    if (ten == null) {
        ten = t3.match(/EP\d\d/g); //Temp 02 -
    }

    if (ten == null) {
        ten = t1.match(/EP\.\d\d\d/g); //Temp 02 -
    }
    if (ten == null) {
        ten = t2.match(/EP\.\d\d\d/g); //Temp 02 -
    }
    if (ten == null) {
        ten = t3.match(/EP\.\d\d\d/g); //Temp 02 -
    }

    if (ten == null) {
        ten = t1.match(/EP\.\d\d/g); //Temp 02 -
    }
    if (ten == null) {
        ten = t2.match(/EP\.\d\d/g); //Temp 02 -
    }
    if (ten == null) {
        ten = t3.match(/EP\.\d\d/g); //Temp 02 -
    }


    if (ten == null) {
        ten = t1.match(/-\d\d/g); //
    }
    if (ten == null) {
        ten = t2.match(/-\d\d/g); //
    }
    if (ten == null) {
        ten = t3.match(/-\d\d/g); //
    }



    if (ten == null) {
        ten = t1.match(/X\d\d/g); //
    }
    if (ten == null) {
        ten = t2.match(/X\d\d/g); //
    }
    if (ten == null) {
        ten = t3.match(/X\d\d/g); //
    }

    if (ten == null) {
        ten = t1.match(/\d\d - /g); //
    }
    if (ten == null) {
        ten = t2.match(/\d\d - /g); //
    }
    if (ten == null) {
        ten = t3.match(/\d\d - /g); //
    }

    if (ten == null) {
        ten = t1.match(/\d - /g); //
    }
    if (ten == null) {
        ten = t2.match(/\d - /g); //
    }
    if (ten == null) {
        ten = t3.match(/\d - /g); //
    }

    if (ten == null) {
        ten = t1.match(/-\d /g); //
    }
    if (ten == null) {
        ten = t2.match(/-\d /g); //
    }
    if (ten == null) {
        ten = t3.match(/-\d /g); //
    }

    if (ten == null) {
        ten = t1.match(/\d\d.MP4/g); //
    }
    if (ten == null) {
        ten = t2.match(/\d\d.MP4/g); //
    }
    if (ten == null) {
        ten = t3.match(/\d\d.MP4/g); //
    }


    if (ten != null) {
        tempo = ten[0];
        var tempo2 = tempo.replace('-', '').replace('MP4', '').replace(' ', '').replace('E', '').replace('X', '').replace('P', '').replace('.', '').replace('.', '').replace('M', '').replace('I', '');
        tempo = tempo2 - 0;
        //append("EP:"+tempo +" " + tempo2 +" " + t1 + " " + t2 + " " + t3+ " " + log);        

    } else {

//append("EP Não Encontrado: " + t1 + " " + t2 + " " + t3+ " " + log);

    }
    return tempo;
}

function l(log) {
    console.log(log);
}
    