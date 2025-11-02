@echo off
echo Running OpenStreetMap integration test...
python scripts/test_osm.py
if %errorlevel% neq 0 (
    echo Error running OSM test
    exit /b %errorlevel%
)

echo Running Roboflow integration test...
python scripts/test_roboflow.py
if %errorlevel% neq 0 (
    echo Error running Roboflow test
    exit /b %errorlevel%
)

echo All tests completed successfully!