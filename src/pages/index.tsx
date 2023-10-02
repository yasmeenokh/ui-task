import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/Home.module.css'
import Accordion from './components/accordion/Accordion'
import { getRequest, postRequest } from '@/services/http.service'

export default function Home({proceduresType, extraFieldsRes, allProceduresRes} : any) {
  return (
    <>
      <Head>
        <title>Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main}`} dir="rtl">
        <Accordion 
        proceduresType={proceduresType}
        extraFieldsRes={extraFieldsRes}
        allProceduresRes={allProceduresRes}
        />
      </main>
    </>
  )
}

export async function getServerSideProps() {
  const proceduresRes = await getRequest('/GetProcedures', { sort: 'id:ASC', populate: '*' });
  const extraFields = await getRequest('/GetMainData', { sort: 'LookupCategoryId:ASC', populate: '*' });
  const allProcedures = await getRequest('/GetAllCaseProcedures?skip=0&take=10', { sort: 'id:ASC', populate: '*' });

  const proceduresType = proceduresRes.Data;
  const extraFieldsRes = extraFields.Data;
  const allProceduresRes = allProcedures.Data;
  return {
    props: {
      proceduresType,
      extraFieldsRes,
      allProceduresRes,
    },
  };
}
