module.exports=function(grunt){
    grunt.initConfig({
        pkg:grunt.file.readJSON('package.json'),
        
        eslint:{
            target:['Gruntfile.js','game.js','js/**/*.js','!js/libs/*.js'],
            options:{
                config:".selintrc.js"
            }
        },
        
        watch:{
            build:{
                files:['Gruntfile.js','game.js','js/**/*.js','!js/libs/*.js'],
                tasks:['eslint'],
                options:{
                    spawn:false
                }
            }
        }
    })
    
    grunt.loadNpmTasks('grunt-eslint')
    grunt.loadNpmTasks('grunt-contrib-watch')
    
    //grunt.registerTask('default',['eslint','watch'])
    grunt.registerTask('default',['eslint'])
}