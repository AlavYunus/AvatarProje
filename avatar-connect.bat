
@echo off
echo Avatar ERP baglantilari ayarlaniyor...

set "ADB=%LOCALAPPDATA%\Android\Sdk\platform-tools\adb.exe"

"%ADB%" reverse tcp:5173 tcp:5173
"%ADB%" reverse tcp:8080 tcp:8080

echo.
echo Port yonlendirmeleri tamamlandi.
echo Vite ve Go sunucularinin calistigindan emin olun.
pause
