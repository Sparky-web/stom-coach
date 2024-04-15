$source_dir = $PSScriptRoot
$dest_dir = Join-Path -Path $PSScriptRoot -ChildPath "dest"
$max_files = 50

if (!(Test-Path -Path $dest_dir)) {
    New-Item -ItemType Directory -Path $dest_dir | Out-Null
}

if (!(Test-Path -Path $dest_dir\1)) {
    New-Item -ItemType Directory -Path $dest_dir\1 | Out-Null
}
$dest_subdir = 1

$files = Get-ChildItem -Path $source_dir -Filter *.zip -Recurse | Where-Object { $_.FullName -notlike "*$dest_dir*" }

$files | ForEach-Object {
    if ($_.DirectoryName -ne $source_dir) {
        $base_file = $_.Name
        if ((Get-ChildItem -Path $dest_dir\$dest_subdir -Filter *.zip).Count -ge $max_files -or (Test-Path -Path $dest_dir\$dest_subdir\$base_file)) {
            $script_dir_name = Split-Path -Path $PSScriptRoot -Leaf
            $zip_file = Join-Path -Path $dest_dir -ChildPath "$dest_subdir\$script_dir_name.zip"
            Compress-Archive -Path "$dest_dir\$dest_subdir\*" -DestinationPath $zip_file
            
            $dest_subdir++
            New-Item -ItemType Directory -Path $dest_dir\$dest_subdir | Out-Null
        }
        Copy-Item -Path $_.FullName -Destination $dest_dir\$dest_subdir
    }
}

pause