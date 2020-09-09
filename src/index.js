const express = require('express')
require('./db/mongoose')

const userRouter = require('./routers/user')

const app = express()
const port = process.env.PORT

app.use(express.json())
app.use(userRouter)

app.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})


const Entry = require('./models/entry')
const PaymentMethod = require('./models/paymentMethod')

async function main () { 
    
    let paymentMethod = new PaymentMethod({
        description: 'teste'
    })

    await paymentMethod.save()


    let entry = new Entry({
        description: 'Teste',
        amount: 10.50,
        type: 'Expense',
        paymentMethod: '',
    })

}

main()