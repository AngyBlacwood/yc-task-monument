yc serverless container revision deploy --min-instances 1 --container-name monuments-container-1 --image cr.yandex/crp7vac032flvli3dqcs/monument:latest --cores 1 --memory 128MB --core-fraction 20 --concurrency 1 --service-account-id aje4r93v57c754ir6e6e --execution-timeout 30s --folder-id b1gshebnmq0ujk17vs79 --environment database=/ru-central1/b1gc4b8p67v2i97r72p7/etn1vg5qbb3l6tnlc2pl,endpoint=grpcs://ydb.serverless.yandexcloud.net:2135,USE_METADATA_CREDENTIALS=1,containerId=bba335jqcvim9i0eumrv,folderId=b1gshebnmq0ujk17vs79