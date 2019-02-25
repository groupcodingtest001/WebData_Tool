from   WebData_Tool.dmp_tc import dmp_tc
import os



def bckend01(i_tcpath):
       try: 
           dmp_tc(i_tcpath);
       except:
           pass
       finally:
          os.remove(i_udpath);
          for file02_item in os.listdir(i_tcpath):
                os.remove(i_tcpath+'/'+file02_item);