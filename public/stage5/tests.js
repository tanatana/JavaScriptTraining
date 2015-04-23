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
      var fetchedFriendList = [];
      var fetchFriendsRecursive = function(targets){
        return fetchFriends(targets).then(function(res){
          var friends = Array.prototype.concat.apply([], res);
          fetchedFriendList = fetchedFriendList.concat(friends);
          if (friends.length == 0) {
            return fetchedFriendList;
          }
          return fetchFriendsRecursive(friends);
        });
      };

      var fetchFriends = function(targets){
        return Promise.all(targets.map(function(target){return fetchFriend(target);}));
      };
      var fetchFriend = function(target){
        return fetch(api + target).then(function(res) {
          return res.json();
        });
      };

      promisedFriends = fetchFriendsRecursive(['CoffeeScript']);

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
