﻿mkdocs build --clean
git checkout gh-pages
Copy-Item -Path .\site\* -Destination . -Recurse -Force
Remove-Item -Path .\site\ -Recurse -Force
git add .
git commit -m "Build newest version"
git push
git checkout main