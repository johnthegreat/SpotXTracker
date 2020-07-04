/**
 *
 */

/* jshint -W097 */
/* jshint -W034 */
module.exports = function(grunt) {
	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		terser: {
			options: {},
			target: {
				mangle: {},
				compress: {},
				sourceMap: {
					url: 'inline'
				},
				files: {
					'public/js/devices.min.js': ['public/js/devices.js'],
					'public/js/index.min.js': ['public/js/index.js'],
					'public/js/modals/ConfirmActionModal.min.js': ['public/js/modals/ConfirmActionModal.js'],
					'public/js/modals/CreateEditDeviceModal.min.js': ['public/js/modals/CreateEditDeviceModal.js'],
					'public/js/widgets/Component.CheckInsListWidget.min.js': ['public/js/widgets/Component.CheckInsListWidget.js'],
					'public/js/widgets/Component.DeviceListWidget.min.js': ['public/js/widgets/Component.DeviceListWidget.js']
				}
			}
		},
		cssmin: {
			options: {
				mergeIntoShorthands: false,
				roundingPrecision: -1
			},
			target: {
				files: {
					'public/css/index.min.css': ['public/css/index.css']
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-terser');
	grunt.loadNpmTasks('grunt-contrib-cssmin');

	// Default task(s).
	grunt.registerTask('default',['terser','cssmin']);
};
