cmake_minimum_required(VERSION 2.8.9)
project (Clipboard)

set(EXECUTABLE_OUTPUT_PATH "..")

add_executable(Clipboard_COPY clipboard_copy.c)
add_executable(Clipboard_CUT clipboard_cut.c)
add_executable(Clipboard_GET clipboard_has_uris.c)


# GTK+ library
find_package(PkgConfig)
if (PKG_CONFIG_FOUND)
  pkg_check_modules(GTK "gtk+-3.0")
  if (GTK_FOUND)
    add_definitions(${GTK_CFLAGS} ${GTK_CFLAGS_OTHER})
  endif()
endif()

if (GTK_FOUND)
    target_link_libraries(Clipboard_COPY ${GTK_LIBRARIES})
    target_link_libraries(Clipboard_CUT ${GTK_LIBRARIES})
    target_link_libraries(Clipboard_GET ${GTK_LIBRARIES})
endif()

#`pkg-config --cflags --libs gtk+-3.0 glib-2.0`

