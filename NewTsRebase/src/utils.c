/*
 * This file is part of the id3v2lib library
 *
 * Copyright (c) 2013, Lorenzo Ruiz
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "utils.h"

unsigned int btoi(char* bytes, int size, int offset)
{
    unsigned int result = 0x00;
    int i = 0;
    for(i = 0; i < size; i++)
    {
        result = result << 8;
        result = result | (unsigned char) bytes[offset + i];
    }
    
    return result;
}

char* itob(int integer)
{
    int size = 4;
    char* result = (char*) malloc(sizeof(char) * size);
    
    // We need to reverse the bytes because Intel uses little endian.
    char* aux = (char*) &integer;
    for(int i = size - 1; i >= 0; i--)
    {
        result[size - 1 - i] = aux[i];
    }
    
    return result;
}

int syncint_encode(int value)
{
    int out = 0, mask = 0x7F;
    
    while (mask ^ 0x7FFFFFFF) {
        out = value & ~mask;
        out <<= 1;
        out |= value & mask;
        mask = ((mask + 1) << 8) - 1;
        value = out;
    }
    
    return out;
}

int syncint_decode(int value)
{
    unsigned int a, b, c, d, result = 0x0;
    a = value & 0xFF;
    b = (value >> 8) & 0xFF;
    c = (value >> 16) & 0xFF;
    d = (value >> 24) & 0xFF;
    
    result = result | a;
    result = result | (b << 7);
    result = result | (c << 14);
    result = result | (d << 21);
    
    return result;
}


/*
 Match the string in "to_match" against the compiled regular
 expression in "r".
 */



/* Compile the regular expression described by "regex_text" into
 "r". */
static int compile_regex (regex_t * r, const char * regex_text)
{
    int status = regcomp (r, regex_text, REG_EXTENDED|REG_NEWLINE);
    if (status != 0) {
        char error_message[MAX_ERROR_MSG];
        regerror (status, r, error_message, MAX_ERROR_MSG);
        printf ("Regex error compiling '%s': %s\n",
                regex_text, error_message);
        return 1;
    }
    return 0;
}


char * match_regex (const char *regex_key , const char * to_match)
{
    regex_t regex;
    char *returnVal=NULL;
    /* "P" is a pointer into the string which points to the end of the
     previous match. */
    const char * p = to_match;
    /* "N_matches" is the maximum number of matches allowed. */
    const int n_matches = 10;
    /* "M" contains the matches found. */
    compile_regex(& regex, regex_key);
    
    regmatch_t m[n_matches];
    int i = 0;
    int nomatch = regexec (&regex, p, n_matches, m, 0);
    if (nomatch) {
        //  printf ("No more matches.\n");
        regfree (& regex);
        return NULL;
    }
    for (i = 0; i < n_matches; i++) {
        int start;
        int finish;
        if (m[i].rm_so == -1) {
            break;
        }
        start = m[i].rm_so + (p - to_match);
        finish = m[i].rm_eo + (p - to_match);
        if (i > 0){
            int length=finish - start;
            returnVal=(char*)malloc((length+1)* sizeof(char));
            if (returnVal)
            {
                memcpy(returnVal,to_match + start,length);
                returnVal[length]='\0';
            }
            else
            {
                printf("ERROR: Out of memory\n");
            }
            regfree (& regex);
            return returnVal;
        }
        
    }
    p += m[0].rm_eo;
    regfree (& regex);
    return NULL;
}


void free_list_ID3_struct(ID3v2_struct* head){
    ID3v2_struct* tmp;
    
    while (head != NULL)
    {
        tmp = head;
        head = head->next;
        free(tmp->objectType);
        free(tmp);
    }

}
