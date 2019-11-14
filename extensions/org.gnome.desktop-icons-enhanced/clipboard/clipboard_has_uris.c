#include <gtk/gtk.h>
#include <gdk/gdk.h>

void receiveData(GtkClipboard *clipboard, GtkSelectionData *selection_data, gpointer data){
    gint length;
    length = 0;

    const guchar* result = gtk_selection_data_get_data_with_length(selection_data,&length);

    printf("%s",result);
    gtk_main_quit();
}

int main(int argc, char* argv[])
{
    gtk_init(&argc, &argv);
    // load clipboard
    if (argc != 2){
        printf("No given parameter: HAS, GET\n");
        return 0;
    }

    GtkClipboard* clipboard = gtk_clipboard_get(GDK_SELECTION_CLIPBOARD);
    gboolean has_copyfiles = gtk_clipboard_wait_is_target_available(clipboard, gdk_atom_intern ("x-special/gnome-copied-files", FALSE));
    if (strncmp("HAS",argv[1],3) == 0) {
        if (has_copyfiles){
            printf("{\"result\":true}");
        }else {
            printf("{\"result\":false}");
        }
        return 0;
    }
    else if (has_copyfiles && strncmp("GET",argv[1],3) == 0) {
        gtk_clipboard_request_contents (clipboard,
                                gdk_atom_intern ("x-special/gnome-copied-files", FALSE),
                                receiveData,
                                NULL);
        gtk_main();
        return 0;

    }else{
        printf("Unknown parameter or no data in clipboard!\n");
        return 0;
    }
}
