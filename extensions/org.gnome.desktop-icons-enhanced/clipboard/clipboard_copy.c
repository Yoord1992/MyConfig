#include <gtk/gtk.h>
#include <gdk/gdk.h>

enum {
    TARGET_URI_LIST,
    TARGET_GNOME_URI_LIST,
    TARGET_UTF8_STRING,
};

typedef struct {
    int n_files;
    gchar** filepaths;
} files_info;

int getUriLength(gchar* path){
    // return length of uri for given path, excluding final NULL character
    gchar* prefix = "file://";
    int prefix_length = strlen(prefix);
    int path_length = strlen(path);
    int res_length = prefix_length + path_length;
    return res_length;
}

void getUriFromPath(gchar* path,gchar* uri){
    gchar* prefix = "file://";
    int prefix_length = strlen(prefix);
    int path_length = strlen(path);
    // final output uri string including final NULL character
    int res_length = prefix_length + path_length + 1;
    // initialize output string with prefix + NULL character
    strncpy(uri,prefix,prefix_length+1);
    // add file path
    strncat(uri, path,path_length);
}


void getFun(GtkClipboard *clipboard,
            GtkSelectionData *selection_data,
            guint info,
            gpointer user_data_or_owner){
    // retrieve input data
    files_info* inf = (files_info*) user_data_or_owner;
    // handle output targets/formats
    switch (info) {
        case TARGET_URI_LIST:
            // list of uris as array
            {
                gchar* uris[inf->n_files+1];

                for (int i=0;i<inf->n_files;i++){
                    // filepath to uri
                    gchar* p = inf->filepaths[i];
                    gchar* uri = (gchar*) malloc(sizeof(gchar)*(getUriLength(p)+1));
                    getUriFromPath(p,uri);
                    uris[i] = uri;
                }
                // set final NULL ptr
                uris[inf->n_files] = NULL;

                gtk_selection_data_set_uris(selection_data,uris);

                // release resources
                for (int i=0;i<inf->n_files;i++){
                    free(uris[i]);
                }
            }
            break;

        case TARGET_GNOME_URI_LIST:
            // copy files for nautilus / x window system
            // format:
            // copy\nURI1\nURI2\nURI3
            {
                // determine length of final string

                // length of each uri excluding NULL character
                int all_lengths[inf->n_files];
                // length of final string
                int res_length = strlen("copy\n");
                for (int i=0;i<inf->n_files;i++){
                    // filepath to uri
                    gchar* p = inf->filepaths[i];
                    int uri_length = getUriLength(p);
                    if (i+1 == inf->n_files){
                        // final uri -> no \n linebreak
                        res_length += uri_length;
                    }else{
                        // uri with \n appended
                        res_length += uri_length+1;
                    }
                    all_lengths[i] = uri_length;
                }
                // initialize final string
                gchar res[res_length+1];

                // initialize with NULL character
                strncpy(res,"copy\n",strlen("copy\n")+1);
                // write all uris into string
                for (int i=0;i<inf->n_files;i++){
                    gchar* p = inf->filepaths[i];
                    int uri_length = getUriLength(p);
                    gchar uri[uri_length+1];
                    getUriFromPath(p,uri);

                    if (i+1 == inf->n_files){
                        strncat(res, uri,uri_length+1);
                    }else{
                        strncat(res, uri,uri_length);
                        gchar* nl = "\n";
                        strncat(res, nl,1);
                    }
                }

                gtk_selection_data_set(
                    selection_data,
                    //gdk_atom_intern ("x-special/gnome-copied-files", FALSE),
                    gtk_selection_data_get_target(selection_data),
                    8,
                    res,
                    strlen(res)
                );
            }
            break;

        case TARGET_UTF8_STRING:;
            // filepaths as output
            {
                int lengths[inf->n_files];
                int res_length = 1;
                for (int i=0;i<inf->n_files;i++) {
                    lengths[i] = strlen(inf->filepaths[i]);
                    if (i+1 == inf->n_files){
                        res_length += lengths[i];
                    }else{
                        res_length += lengths[i] + 1;
                    }
                }
                gchar res[res_length];
                strncpy(res,"",1);
                for (int i=0;i<inf->n_files;i++){
                    strncat(res,inf->filepaths[i],strlen(inf->filepaths[i]));
                    if (i+1 != inf->n_files) {
                        gchar* nl = "\n";
                        strncat(res, nl,1);
                    }
                }
                gtk_selection_data_set_text(
                    selection_data,
                    res,
                    strlen(res)
                    );
            }
            break;
        default:
            break;
    }
}

void clearFun(GtkClipboard *clipboard,
            gpointer user_data_or_owner){
    // new data replaced our data into clipboard
    // stop application
    gtk_main_quit();
}


int main(int argc, char* argv[])
{
    if (argc < 2){
        printf("No files given!\n");
        return 0;
    }
    gtk_init(&argc, &argv);
    // init vars
    gchar* fpaths[argc - 1];
    files_info inf = {argc - 1, fpaths};

    // copy filepaths
    for (int i=0;i<inf.n_files;i++){
        inf.filepaths[i] = argv[i+1];
    }
    // load clipboard
    GtkClipboard* clipboard = gtk_clipboard_get(GDK_SELECTION_CLIPBOARD);
    // setup targets
    GtkTargetEntry urillists =  { "text/uri-list", 0, TARGET_URI_LIST };
    GtkTargetEntry gnomecopy =  { "x-special/gnome-copied-files", 0, TARGET_GNOME_URI_LIST };
    GtkTargetEntry utf8 = { "TARGET_UTF8_STRING", 0, TARGET_UTF8_STRING };
    // compile target list
    GtkTargetEntry entries[3] = {urillists,gnomecopy,utf8};
    // set data to clipboard
    gtk_clipboard_set_with_data(clipboard,entries,3,getFun,clearFun,&inf);

    gtk_clipboard_store(clipboard);
    // run the GTK main loop
    gtk_main();
    return 0;
}
