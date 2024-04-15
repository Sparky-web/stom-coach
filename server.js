// @ts-ignore
import express from 'express';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import fs from 'fs';

const app = express();
app.use(express.json());

app.post('/Session/api/session', (req, res) => {
    const { username, password } = req.body;
    if (username === 's04_vershinin' && password === 'astramed01r') {
        const token = jwt.sign({ username }, 'your-secret-key');
        res.json({ status: 'OK', detail: { data: { hash: token } } });
    } else {
        res.status(401).json({ message: 'Invalid username or password' });
    }
});

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);
    jwt.verify(token, 'your-secret-key', (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

const upload = multer({ dest: 'uploads/' });

let taskId = 0;

let tasks = []

app.post('/ULoader/api/v1/tasks/upload', authMiddleware, upload.single('files'), (req, res) => {
    taskId++;
    const filename = `${req.file.originalname}`;

    // fs.writeFile(`uploads/${filename}`, req.file.buffer, err => {
    //     if (err) return res.sendStatus(500);

    tasks.push({ id: taskId, filename });

    res.json({ data: [{ id: taskId }] });
    // });
});

app.get('/ULoader/api/v1/task_stages', upload.none(), (req, res) => {
    const idTask = req.body.idTask;
    const task = tasks.find(task => task.id === Number(idTask));

    if (!task) {
        return res.status(404).json({ message: 'Task not found' });
    }

    const currentTimestamp = new Date().toISOString();

    const responseObject = {
        timestamp: currentTimestamp,
        message: "Успешно",
        status: "OK",
        data: [
            {
                id: 110,
                idUlStage: "IN_QUEUE",
                idUlTask: 77,
                dcreate: currentTimestamp,
                dend: currentTimestamp,
                result: "OK",
                text: "Файд взят в обработку",
                stageName: "Постановка задачи в очередь",
                files: [
                    {
                        id: 77,
                        idTaskStage: 110,
                        type: 0,
                        filename: "I66004_428_1122002.zip",
                        url: "/ULoader_LoadZL/2024-02/22/77/s04_ageeva/a4b27c35-d733-4c61-a8a9-ab9402bff5a8",
                        text: "Загруженный файл"
                    }
                ]
            },
            {
                id: 111,
                idUlStage: "CHECK_FLK",
                idUlTask: 77,
                dcreate: new Date(new Date(currentTimestamp).getTime() + 1000).toISOString(),
                dend: new Date(new Date(currentTimestamp).getTime() + 2000).toISOString(),
                result: "OK",
                text: "ФЛК пройден успешно",
                stageName: "Проверка ФЛК",
                files: []
            },
            {
                id: 112,
                idUlStage: "PROCESS",
                idUlTask: 77,
                dcreate: new Date(new Date(currentTimestamp).getTime() + 3000).toISOString(),
                dend: new Date(new Date(currentTimestamp).getTime() + 4000).toISOString(),
                result: "OK",
                text: "Файл загружен",
                stageName: "Обработка файла",
                files: []
            },
            {
                id: 113,
                idUlStage: "RESULT",
                idUlTask: 77,
                dcreate: new Date(new Date(currentTimestamp).getTime() + 5000).toISOString(),
                dend: new Date(new Date(currentTimestamp).getTime() + 6000).toISOString(),
                result: "OK",
                text: "Протокол сформирован",
                stageName: "Результат обработки",
                files: [
                    {
                        id: 78,
                        idTaskStage: 113,
                        type: 1,
                        filename: "p66062_79_06161001.zip",
                        url: "/2023/LoadZL/9b98f99e-6f77-4312-be92-4ab6fd28b99d/",
                        text: "Протокол обработки"
                    }
                ]
            }
        ],
        innerCode: "0",
        innerText: ""
    };

    res.json(responseObject);
});

app.post('/ULoader/api/v1/files/:taskId/download', authMiddleware, (req, res) => {
    const taskId = req.params.taskId;
    const task = tasks.find(task => task.id === Number(taskId));

    if (!task) {
        return res.status(404).json({ message: 'Task not found' });
    }

    const filePath = `uploads/${task.filename}`;

    res.download(filePath, task.filename, err => {
        if (err) {
            return res.status(500).json({ message: 'File download failed' });
        }
    });
});


app.listen(3000, () => console.log('Server started on port 3000'));