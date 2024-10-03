import db from '../../lib/db';
import Link from 'next/link';


export default async function Users() {
    const [rows,fields] = await db.query('SELECT * FROM user');
    //console.log(rows)
    //const users = await rows.json()

    //const user={}

    return (
        <div>
            <h1>Users list</h1>
            <ul>
                {rows.map((user) => (
                    <li key={user.id}>
                        <Link href={`/users/${user.id}`}>
                            {user.username}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}


