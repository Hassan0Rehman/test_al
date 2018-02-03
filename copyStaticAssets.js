var shell = require('shelljs');

shell.rm('-R', 'dist/public/webpack/*');
shell.cp('-R', 'src/public/js', 'dist/public/');
shell.cp('-R', 'src/public/fonts', 'dist/public/');
shell.cp('-R', 'src/public/images', 'dist/public/');
shell.cp('-R', 'src/public/optimized', 'dist/public/');
shell.cp('-R', 'src/public/uploaded', 'dist/public/');
shell.cp('-R', 'src/public/webpack', 'dist/public/');
shell.cp('-R', 'src/public/BingSiteAuth.xml', 'dist/public/');
shell.cp('-R', 'src/public/icon-spritesheet.png', 'dist/public/');
shell.cp('-R', 'google963339dea71f7c3d.html', 'dist/public/');
shell.cp('-R', 'views', 'dist/');
