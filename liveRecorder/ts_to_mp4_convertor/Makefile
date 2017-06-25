CC = gcc -v
SRC = $(wildcard *.c)
DEPS = $(wildcard *.h)
ODIR=obj
_OBJ = $(SRC:.c=.o)
OBJ = $(patsubst %,$(ODIR)/%,$(_OBJ))
_EXE = ts_to_mp4_convertor
EXE = $(patsubst %,$(ODIR)/%,$(_EXE))
FFMPEG_LIB_DIR := $(shell echo $(FFMPEG_BUILD_PATH))
IDIRS = -I. -I$(FFMPEG_LIB_DIR)
LDIR = -L$(FFMPEG_LIB_DIR)/libswscale -L$(FFMPEG_LIB_DIR)/libavdevice -L$(FFMPEG_LIB_DIR)/libavutil -L$(FFMPEG_LIB_DIR)/libavformat -L$(FFMPEG_LIB_DIR)/libavcodec -L/usr/local/lib
FFMPEG_LIBS = -lswscale -lavdevice -lavformat -lavcodec -lavutil
LIBS = -lpthread  -lm -lz
CFLAGS = -Wall -g $(IDIRS)
LDFLAGS =  $(LDIR) $(FFMPEG_LIBS) $(LIBS)
OS := $(shell uname)

ifeq ($(OS), Linux)
    LIBS += -lrt
else
	LIBS += -liconv
endif

$(ODIR)/%.o: %.c $(DEPS)
	$(CC) -c -o $@ $< $(CFLAGS)

$(EXE): $(OBJ)
	$(CC) -o $@ $^ $(LDFLAGS)

$(phony install): install

install: $(EXE)
	mkdir -p ../bin
	install $(EXE) ../bin/

.PHONY: clean

clean:
	rm -rf $(ODIR)/*.o $(EXE)
