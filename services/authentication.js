myApp.factory("Authentication", ['$rootScope', '$firebaseAuth', 'FIREBASE_URL', '$location', '$firebaseObject',
    function ($rootScope, $firebaseAuth, FIREBASE_URL, $location, $firebaseObject) {
    var ref = new Firebase(FIREBASE_URL);
    var auth = $firebaseAuth(ref);
    //Determing authentication events
    auth.$onAuth(function (authUser) {
        if (authUser) {
            var userRef = new Firebase(FIREBASE_URL + "users/" + authUser.uid);
            var userObj = $firebaseObject(userRef);
            $rootScope.currentUser = userObj;
        }
        else {
            $rootScope.currentUser = '';
        }
    });
    return {
        login: function (user) {
            auth.$authWithPassword({
                email: user.email,
                password: user.password
            }).then(function (regUser) {
                $location.path('/application');
            }).catch(function (error) {
                $rootScope.message = error.message;
            });
            $rootScope.message = "Welcome " + user.email;
        },
        requireAuth: function () {
            if(auth.$getAuth()){
                return auth.$requireAuth();
            } else {
                return $location.path('/login')
            }
        },//require Authentication
        logout: function () {
            auth.$unauth();
        },//LOGOUT
        register: function (user) {
            auth.$createUser({
                email: user.email,
                password: user.password
            }).then(function (regUser) {
                var regRef = new Firebase(FIREBASE_URL + "users").child(regUser.uid).set({
                    date: Firebase.ServerValue.TIMESTAMP,
                    regUser: regUser.uid,
                    first_name: user.firstname,
                    last_name: user.lastname,
                    email: user.email
                });
                $rootScope.message = "Hi " + user.firstname + ",Thanks for registering";
            }).catch(function (error) {
                $rootScope.message = error.message;
            });
        },
        submitApplication: function(user) {
            $rootScope.message = "trying to submit form...";
            console.log(user);
            /*auth.$getAuth().then(function (regUser) {
                console.log('sucess'+ regUsr);
                $location.path('/application');
            }).catch(function (error) {
                $rootScope.message = error.message;
            });*/
            $rootScope.message = "Welcome " + $scope.currentUser.email;
            console.log();
        }
    };
}
]);
