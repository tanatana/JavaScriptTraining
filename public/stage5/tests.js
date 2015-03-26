'use strict';

describe('ステージ5（意図通りに非同期処理を利用できる）', function() {
  describe('Promise 編', function() {
    it('resolve ハンドラーを書ける', function(testDone){
      var promise = Promise.resolve('resolved!');

      // チュートリアル
      //
      // ここに下記のコードを記述してください。
      //
      // promise.then(function(msg) {
      //   expect(msg).to.equal('resolved!');
      //   testDone();
      // });
    });


    it('reject ハンドラーを書ける', function(testDone){
      var promise = Promise.reject('rejected!');

      // reject ハンドラーを使って、下の assertion が promise の
      // エラー値を検証できるように記述してください。
      //
      // expect(msg).to.equal('rejected!');
      // testDone();

      // ここにコードを記述してください。


    });


    it('複数の promise すべての完了を待つ promise を作成できる', function(){
      var messageFragments = ['あなたと', 'java', '今すぐダウンロード'];
      var promise1 = createWaitPromise(messageFragments[0], 10);
      var promise2 = createWaitPromise(messageFragments[1], 20);
      var promise3 = createWaitPromise(messageFragments[2], 30);

      // 作成した promise を promise 変数に代入してください。
      var promise;


      return expect(promise).to.eventually.deep.equal(messageFragments);
    });


    it('複数の promise のうち最も速く解決された値をもつ promise を作成できる', function(){
      var messageFragments = ['30億の', 'デバイスで', '走るjava'];
      var promise1 = createWaitPromise(messageFragments[0], 30);
      var promise2 = createWaitPromise(messageFragments[1], 10);
      var promise3 = createWaitPromise(messageFragments[2], 30);

      // 作成した promise を promise 変数に代入してください。
      var promise;


      return expect(promise).to.eventually.equal(messageFragments[1]);
    });
  });


  describe('fetch API 編', function() {
    it('/api/friends API を使って Sugar の友人を取得できる', function(){
      var api = '/api/friends/';
      var username = 'Sugar';

      // チュートリアル
      //
      // ここに下記のコードを記述してください。
      //
      // var promisedFriends = fetch(api + username).then(function(res) {
      //   return res.json();
      // });


      return expect(promisedFriends).to.eventually.deep.equal(['PYXC-PJ']);
    });


    it('/api/friends API を使って Shen の友人を取得できる', function(){
      var api = '/api/friends/';
      var username = 'Shen';

      // 作成した promise を promisedFriends 変数に代入してください。
      var promisedFriends;


      return expect(promisedFriends).to.eventually.deep.equal(
        ['jisp', 'TeJaS']
      );
    });


    it('/api/friends API を使って Shen の友人の友人を取得できる', function(){
      var api = '/api/friends/';
      var username = 'Shen';

      // 作成した promise を promisedFriends 変数に代入してください。
      var promisedFriends;


      return expect(promisedFriends).to.eventually.deep.equal(['TypeScript']);
    });


    it.skip('/api/friends API を使って CoffeeScript の友人を再帰的に取得できる', function(){
      // 難易度高いので、自信のある人だけ挑戦してください。
      // it.skip の .skip を消せば、テストが走るようになります。

      // 作成した promise を promisedFriends 変数に代入してください。
      var promisedFriends;


      return expect(promisedFriends).to.eventually.deep.equal(
        ['Taijilang', 'purescript', 'Wind.js', 'ScriptBlocks', 'jangaroo']
      );
    });


    it('Github の mixi-inc の organization の情報を取得できる', function() {

      // 作成した promise を mixiOrg 変数に代入してください。
      var mixiOrg;

      return expect(mixiOrg).to.eventually.have.property('id', 1089312);

      // Github API に関する参考情報
      // https://developer.github.com/v3/repos/
    });


    it('Github API を使って、mixi-inc/JavaScriptTraining の情報を取得できる', function(){
      var repositry = 'mixi-inc/JavaScriptTraining';

      // 作成した promise を mixiRepo 変数に代入してください。
      var mixiRepo;


      return expect(mixiRepo).to.eventually.have.property('full_name', repositry);

      // Github API に関する参考情報
      // https://developer.github.com/v3/orgs
    });


    it('Github API を使って、VimL、Emacs Lisp でスターが最も多いプロダクト名を' +
       'それぞれ 1 つずつ取得できる', function(){
      var languages = [ 'VimL', '"Emacs Lisp"' ];
      var mostPopularRepos;

      // 作成した promise を mostPopularRepos 変数に代入してください。


      return expect(mostPopularRepos).to.eventually.have.length(2);

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