import azure.functions as func
import logging
import json

app = func.FunctionApp()

@app.blob_trigger(arg_name="myblob", 
                  path="data/0_8ddd5e4c938d4b2b936a0b1288daaeeb_1.json",  
                  connection="AZURE_STORAGEBLOB_CONNECTIONSTRING") 
def BlobTrigger1(myblob: func.InputStream):
    logging.info(f"Python blob trigger function processed blob "
                 f"Name: {myblob.name} "
                 f"Blob Size: {myblob.length} bytes")
    
    try:

        blob_content = myblob.read()  
        if blob_content:
            logging.info(f"Raw blob content: {blob_content}")
        else:
            logging.warning("Blob content is empty.")

    except Exception as e:
        logging.error(f"An unexpected error occurred: {e}")
