CC = gcc
SRC = $(wildcard *.c)
DEPS = $(wildcard *.h)
ODIR=obj
_OBJ = $(SRC:.c=.o)
OBJ = $(patsubst %,$(ODIR)/%,$(_OBJ))
_EXE = ts_to_mp4_convertor
EXE = $(patsubst %,$(ODIR)/%,$(_EXE))
FFMPEG_LIB_DIR = ../../node_addons/FormatConverter/build/FFmpeg
IDIRS = -I. -I$(FFMPEG_LIB_DIR)
LDIR = -L$(FFMPEG_LIB_DIR)/libavutil -L$(FFMPEG_LIB_DIR)/libavformat -L$(FFMPEG_LIB_DIR)/libavcodec -L/usr/local/lib
FFMPEG_LIBS = -lavutil -lavformat -lavcodec
LIBS = -liconv -lz -lm
CFLAGS = -Wall -g $(IDIRS)
LDFLAGS =  $(LDIR) $(FFMPEG_LIBS) $(LIBS)

$(ODIR)/%.o: %.c $(DEPS)
	$(CC) -c -o $@ $< $(CFLAGS)

$(EXE): $(OBJ)
	$(CC) -o $@ $^ $(LDFLAGS)

.PHONY: clean

clean:
	rm -rf $(ODIR)/*.o $(EXE)
