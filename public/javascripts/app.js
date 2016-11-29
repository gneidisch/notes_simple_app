angular.module('myNote', [])
.controller('mainController', ($scope, $http) => {
    $scope.formData = {};
    $scope.myNoteList = {};

    // Get all
    $http.get('/api/v1/notes')
        .success((data) => {
            $scope.myNoteList = data;
            console.log(data);
        })
        .error((error) => {
            console.log('Error: ' + error);
        });


    // Create new
    $scope.createNote = () => {
        $http.post('/api/v1/notes', $scope.formData)
            .success((data) => {
                $scope.formData = {};
                $scope.myNoteList = data;
                console.log(data);
            })
            .error((error) => {
                console.log('Error: ' + error);
            });
    };

    // Update
    $scope.updateNote = (noteId, noteBody) => {
        $http.put('/api/v1/notes/' + noteId + '/' + noteBody)
            .success((data) => {
                $scope.formSingle = {};
                $scope.myNoteList = data;
                console.log(data);
            })
            .error((data) => {
                console.log('Error: ' + data);
            });
    };
    
    // Delete
    $scope.deleteNote = (noteId) => {
        $http.delete('/api/v1/notes/' + noteId)
            .success((data) => {
                $scope.myNoteList = data;
                console.log(data);
            })
            .error((data) => {
                console.log('Error: ' + data);
           });
    };


});


$scope.editNote = function(note) {
    $scope.editing = $scope.myNoteList.indexOf(note);
    $scope.tmpEntry = angular.copy(note);
}