import * as mongoose from 'mongoose';

export interface testSchema {

    /**
     * 这是中文
     */

    objectId:
        mongoose.Schema.Types.ObjectId


    /**
     * this is text
     */

    decimal128:
        mongoose.Schema.Types.Decimal128


    /**
     * suDoc1
     */

    suDoc1: [{

        /**
         * subId
         */

        subId: mongoose.Schema.Types.ObjectId


        /**
         * string
         */

        string: string


        /**
         * number
         */

        number: number


        /**
         * _id
         */

        _id: mongoose.Schema.Types.ObjectId


    }]

    /**
     * suDoc2
     */

    suDoc2: [{

        /**
         * foo
         */

        foo: string


    }]

    /**
     * suDoc3
     */

    suDoc3: [
        string
    ]

}

export interface userSchema {

    /**
     * name
     */

    name:
        string


    /**
     * email
     */

    email:
        string


}