#include <stdio.h>
#include <unistd.h>
#include <stdlib.h>


int readFlagFile() {
    FILE *filePointer;
    char buff[255];
    filePointer = fopen("./flag.txt", "r");
    if (filePointer == NULL) {
        printf("Could not open file\n");
        exit(0);
    }
    fgets(buff,255, (FILE*) filePointer);
    printf("%s\n",buff);
    fclose(filePointer);
}

int main(int argc, char *argv[]){
	char buffer[12];
	int overflow_var = 0x000;
	
	printf("Please Input Text Here:\n");

    gets(buffer);

	if (overflow_var == 0x67416c46) {
		readFlagFile();
    }
    
	return 0;
}
