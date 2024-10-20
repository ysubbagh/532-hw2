import azure.functions as func
import logging

app = func.FunctionApp()

@app.blob_trigger(arg_name="myblob", path="data/0_a8f66b8f39ff45cd90da37bdc46ba321_1.json",
                               connection="AZURE_STORAGEBLOB_CONNECTIONSTRING") 
def blob_trigger(myblob: func.InputStream):
    logging.info(f"Python blob trigger function processed blob"
                f"Name: {myblob.name}"
                f"Blob Size: {myblob.length} bytes")
