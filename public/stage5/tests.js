'use strict';

describe('ステージ5（意図通りに非同期処理を利用できる）', function() {
  describe('Promise 編', function() {
    it('resolve ハンドラーを書ける', function(testDone){
      var promise = Promise.resolve('resolved!');

      // チュートリアル
      //
      // ここに下記のコードを記述してください。
      //
      promise.then(function(msg) {
        expect(msg).to.equal('resolved!');
        testDone();
      });
    });


    it('reject ハンドラーを書ける', function(testDone){
      var promise = Promise.reject('rejected!');

      // reject ハンドラーを使って、下の assertion が promise の
      // エラー値を検証できるように記述してください。
      //
      // expect(msg).to.equal('rejected!');
      // testDone();

      // ここにコードを記述してください。

      promise.catch(function(msg) {
        expect(msg).to.equal('rejected!');
        testDone();
      });

    });


    it('複数の promise すべての完了を待つ promise を作成できる', function() {
      var messageFragments = ['あなたと', 'java', '今すぐダウンロード'];
      var promise1 = createWaitPromise(messageFragments[0], 10);
      var promise2 = createWaitPromise(messageFragments[1], 20);
      var promise3 = createWaitPromise(messageFragments[2], 30);

      // 作成した promise を promise 変数に代入してください。
      var promise = Promise.all([promise1, promise2, promise3]);

      return expect(promise).to.eventually.deep.equal(messageFragments);
    });


    it('複数の promise のうち最も速く解決された値をもつ promise を作成できる', function() {
      var messageFragments = ['30億の', 'デバイスで', '走るjava'];
      var promise1 = createWaitPromise(messageFragments[0], 30);
      var promise2 = createWaitPromise(messageFragments[1], 10);
      var promise3 = createWaitPromise(messageFragments[2], 30);

      // 作成した promise を promise 変数に代入してください。
      var promise = Promise.race([promise1, promise2, promise3]);


      return expect(promise).to.eventually.equal(messageFragments[1]);
    });
  });


  describe('fetch API 編', function() {
    it('/api/friends API を使って Sugar の友人を取得できる', function() {
      var api = '/api/friends/';
      var username = 'Sugar';

      // チュートリアル
      //
      // ここに下記のコードを記述してください。
      //
      var promisedFriends = fetch(api + username).then(function(res) {
        return res.json();
      });


      return expect(promisedFriends).to.eventually.have.length(1)
        .and.have.members(['PYXC-PJ']);
    });


    it('/api/friends API を使って Shen の友人を取得できる', function() {
      var api = '/api/friends/';
      var username = 'Shen';

      // 作成した promise を promisedFriends 変数に代入してください。
      var promisedFriends =  fetch(api + username).then(function(res) {
        return res.json();
      });


      return expect(promisedFriends).to.eventually.have.length(2)
        .and.have.members(['jisp', 'TeJaS']);
    });


    it('/api/friends API を使って Shen の友人の友人を取得できる', function() {
      var api = '/api/friends/';
      var username = 'Shen';

      // 作成した promise を promisedFriends 変数に代入してください。
      var fetchFriends = function(friends){
        return Promise.all(friends.map(function(friend){return fetchFriend(friend);}));
      };
      var fetchFriend = function(friend){
        return fetch(api + friend).then(function(res) {
          return res.json();
        });
      };

      var promisedFriends = fetchFriends(["jisp", "TeJaS"])
            .then(function(res){return Array.prototype.concat.apply([], res);});

      return expect(promisedFriends).to.eventually.have.length(1)
        .and.have.members(['TypeScript']);
    });


    it('/api/friends API を使って CoffeeScript の友人を再帰的に取得できる', function() {
      // 難易度高いので、自信のある人だけ挑戦してください。
      // it.skip の .skip を消せば、テストが走るようになります。

      // 作成した promise を promisedFriends 変数に代入してください。
      var api = '/api/friends/';
      var promisedFriends = [];
      var fetchFriendsRecursive = function(targets, list){
        list = list || [];
        return fetchFriends(targets).then(function(friends){
          if (friends.length == 0) {
            return list;
          }
          list = list.concat(friends);
          return fetchFriendsRecursive(friends, list);
        });
      };

      var fetchFriends = function(targets){
        return Promise.all(targets.map(fetchFriend))
          .then(flatMap);
      };
      var fetchFriend = function(target){
        return fetch(api + target).then(function(res) {
          return res.json();
        });
      };

      var flatMap = function(list){
        return Array.prototype.concat.apply([], list);
      };

      // 作成した promise を promisedFriends 変数に代入してください。
      promisedFriends = fetchFriendsRecursive(['CoffeeScript']);

      // /**
      //  * 友人を取得する。
      //  * @param {string} usernameToFetch 友人の取得対象のユーザー名。
      //  * @return {Thenable<Array<string>>} 友人の配列。
      //  */
      // function getFriends(usernameToFetch) {
      //   return fetch(api + usernameToFetch)
      //     .then(function(response) {
      //       return response.json();
      //     });
      // }

      // /**
      //  * 配列または配列をもつ promise を展開し、平たい配列をもつ promise を
      //  * 返す。
      //  * @param {Array<Thenable<T>|T>} arrayOfPromisedArray promise または、
      //  *     オブジェクトの配列。
      //  * @return {Thenable<Array<T>>} 平たい配列をもつ promise。
      //  * @template T
      //  */
      // function flatMap(arrayOfPromisedArray) {
      //   return Promise.all(arrayOfPromisedArray)
      //     .then(function(arrayOfArray) {
      //       return arrayOfArray.reduce(function(flatArray, array) {
      //         // JavaScript には破壊的な配列結合がないので、
      //         // Array#push を悪用することが多いです。
      //         Array.prototype.push.apply(flatArray, array);
      //         return flatArray;
      //       }, []);
      //     });
      // }

      // /**
      //  * 配列を結合する関数を返す。この関数の実行前に、結合する配列の片方を
      //  * 指定する必要がある。
      //  * @param {Array<T>} arrayA 関数の実行前に指定する、結合したい配列。
      //  * @return {function(Array<T>): Array<T>} arrayA と arrayB を結合する関数。
      //  * @template T
      //  */
      // function concat(arrayA) {
      //   return function(arrayB) {
      //     return arrayA.concat(arrayB);
      //   };
      // }

      // /**
      //  * 友人を再帰的に取得する。
      //  * @param {string} usernameToFetch 友人の取得対象の名前。
      //  * @return {Thenable<Array<string>>} 友人名の配列をもつ promise。
      //  */
      // function getFriendsRecursively(usernameToFetch) {
      //   return getFriends(usernameToFetch)
      //     .then(function(friends) {
      //       if (friends.length === 0) return friends;

      //       var promisedFriendsOfFriends = Promise.all(
      //         friends.map(getFriendsRecursively));

      //       return promisedFriendsOfFriends
      //         .then(flatMap)
      //         .then(concat(friends));
      //     });
      // }

      // /**
      //  * いい感じにメソッドチェーンの途中で値を出力する
      //  * @param なんか
      //  * @return なんか
      //  */
      // function tap(object){
      //   console.log(object);
      //   return object;
      // }

      // 作成した promise を promisedFriends 変数に代入してください。
      // promisedFriends = getFriendsRecursively('CoffeeScript');

      return expect(promisedFriends).to.eventually.have.length(5)
        .and.have.members([
          'Taijilang',
          'purescript',
          'Wind.js',
          'ScriptBlocks',
          'jangaroo'
        ]);
    });


    it('Github の mixi-inc の organization の情報を取得できる', function() {

      // 作成した promise を mixiOrg 変数に代入してください。
      var endpoint = 'http://api.github.com/';
      var api = 'orgs/';
      var name = 'mixi-inc';
      var mixiOrg = fetch(endpoint + api + name).then(function(res){return res.json();});

      return expect(mixiOrg).to.eventually.have.property('id', 1089312);

      // Github API に関する参考情報
      // https://developer.github.com/v3/orgs
    });


    it('Github API を使って、mixi-inc/JavaScriptTraining の情報を取得できる', function() {
      var repository = 'mixi-inc/JavaScriptTraining';
      var endpoint = 'http://api.github.com/';
      var api = 'repos/';
      var name = 'mixi-inc/';
      var repos = 'JavaScriptTraining';

      // 作成した promise を mixiRepo 変数に代入してください。
      var mixiRepo = fetch(endpoint + api + name + repos).then(function(res){return res.json();});

      return expect(mixiRepo).to.eventually.have.property('full_name', repository);

      // Github API に関する参考情報
      // https://developer.github.com/v3/repos/
    });


    it('Github API を使って、VimL、Emacs Lisp でスターが最も多いプロダクト名を' +
       'それぞれ 1 つずつ取得できる', function() {
      var languages = [ 'VimL', '"Emacs Lisp"' ];
      var mostPopularRepos = 'change me!';

      // 作成した promise を mostPopularRepos 変数に代入してください。
      var queryString = function(params){
        var str = [];
        for(var p in params)
          if (params.hasOwnProperty(p)) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(params[p]));
          }
        return str.join("&");
      };

      var fetchMostPopularRepo = function(keyword){
        var endpoint = 'http://api.github.com/';
        var api = 'search/repositories?';
        var params = {
          q: keyword,
          sort: 'star'
        };
        return fetch(endpoint + api + queryString(params)).then(function(res) {
          return res.json();
        });
      };

      var fetchMostPopularRepos = function(keywords){
        return Promise.all(keywords.map(function(keyword){return fetchMostPopularRepo(keyword);}));
      };

      mostPopularRepos = fetchMostPopularRepos(languages).then(function(res){
        var ret = res.map(function(repos){
          return repos.items[0].name;
        });
        return ret;
      });

      return expect(mostPopularRepos).to.eventually.have.length(2)
        .and.satisfy(function(names) {
          return typeof names[0] === 'string' &&
            typeof names[1] === 'string';
        });

      // Github API に関する参考情報
      // https://developer.github.com/v3/search
    });
  });


  function createWaitPromise(value, msec) {
    return new Promise(function(resolve) {
      setTimeout(resolve, msec, value);
    });
  }
});
