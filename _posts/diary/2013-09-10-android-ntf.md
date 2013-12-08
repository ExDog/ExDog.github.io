---
title: android ntf
date: '2013-09-10'
description:刷卡认证技术
categories: android
---

# android ntf #

##1.ntf 简介 ##

NFC是Near Field Communication缩写，即近距离无线通讯技术。由飞利浦公司
和索尼公司共同开发的NFC是一种非接触式识别和互联技术，可以在移动设备、
消费类电子产品、PC 和智能控件工具间进行近距离无线通信。NFC 提供了一种
简单、触控式的解决方案，可以让消费者简单直观地交换信息、访问内容与服务。

##2.android ntf ##
   android从4.0 以后便支持ntf。以下是一个android ntf例子，跑这个例子需
   要设备自带nfc，然后在设置中打开nfc。程序跑起来后点击，读取卡信息，
   然后将公交啊，放入屏幕上，然后就可以看到log中打印出来的卡的信息；
   `

    public class MainActivity extends Activity {
    private static final String TAG = "stickynotes";
    private boolean mWriteMode = false;
    NfcAdapter mNfcAdapter;
    EditText mNote;
    EditText mNoteRead;
    PendingIntent mNfcPendingIntent;
    IntentFilter[] mWriteTagFilters;
    IntentFilter[] mNdefExchangeFilters;

    /** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);        
        mNote = ((EditText) findViewById(R.id.note));
        mNote.addTextChangedListener(mTextWatcher);
        mNoteRead = ((EditText) findViewById(R.id.noteRead));

        mNfcAdapter = NfcAdapter.getDefaultAdapter(this);//得到设备适
        配
        if (mNfcAdapter==null) {
        	toast("设备不支持nfc!");
        	return;
		}
        findViewById(R.id.write_tag).setOnClickListener(mTagWriter);
        findViewById(R.id.read_tag).setOnClickListener(mTagRead);
		mNfcPendingIntent = PendingIntent.getActivity(this, 0, new Intent(this,
				getClass()).addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP), 0);

		IntentFilter ndefDetected = new IntentFilter(
				NfcAdapter.ACTION_NDEF_DISCOVERED);//读取的信息筛选
		try {
			ndefDetected.addDataType("text/plain");
		} catch (MalformedMimeTypeException e) {
		}
		mNdefExchangeFilters = new IntentFilter[] { ndefDetected };

		IntentFilter tagDetected = new IntentFilter(
				NfcAdapter.ACTION_TAG_DISCOVERED);
		mWriteTagFilters = new IntentFilter[] { tagDetected };
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (NfcAdapter.ACTION_NDEF_DISCOVERED.equals(getIntent().getAction())) {
            NdefMessage[] messages = getNdefMessages(getIntent());
            byte[] payload = messages[0].getRecords()[0].getPayload();
            setNoteBody(new String(payload));
            setIntent(new Intent()); // Consume this intent.
        }
        if (mNfcAdapter!=null) {
        	enableNdefExchangeMode();
        }
    }

    @Override
    protected void onPause() {
        super.onPause();
        if (mNfcAdapter!=null) {
        	mNfcAdapter.disableForegroundNdefPush(this);
        }
    }

    @Override
    protected void onNewIntent(Intent intent) {
        // NDEF exchange mode
        if (!mWriteMode && NfcAdapter.ACTION_NDEF_DISCOVERED.equals(intent.getAction())) {
            NdefMessage[] msgs = getNdefMessages(intent);
            String body = new String(msgs[0].getRecords()[0].getPayload());
            setNoteBody(body);
        }

        // Tag writing mode
        if (mWriteMode && NfcAdapter.ACTION_TAG_DISCOVERED.equals(intent.getAction())) {
            Tag detectedTag = intent.getParcelableExtra(NfcAdapter.EXTRA_TAG);
            writeTag(getNoteAsNdef(), detectedTag);
        }
    }

    private TextWatcher mTextWatcher = new TextWatcher() {

        @Override
        public void onTextChanged(CharSequence arg0, int arg1, int arg2, int arg3) {

        }

        @Override
        public void beforeTextChanged(CharSequence arg0, int arg1, int arg2, int arg3) {

        }

        @Override
        public void afterTextChanged(Editable arg0) {
        }
    };

    private View.OnClickListener mTagWriter = new View.OnClickListener() {
        @Override
        public void onClick(View arg0) {
            // Write to a tag for as long as the dialog is shown.
            disableNdefExchangeMode();
            enableTagWriteMode();

            new AlertDialog.Builder(MainActivity.this).setTitle("Touch tag to write")
                    .setOnCancelListener(new DialogInterface.OnCancelListener() {
                        @Override
                        public void onCancel(DialogInterface dialog) {
                            disableTagWriteMode();
                            enableNdefExchangeMode();
                        }
                    }).create().show();
        }
    };

    private View.OnClickListener mTagRead = new View.OnClickListener() {
        @Override
        public void onClick(View arg0) {
            // Write to a tag for as long as the dialog is shown.
        	disableTagWriteMode();
            enableNdefExchangeMode();

            new AlertDialog.Builder(MainActivity.this).setTitle("Touch tag to read")
                    .setOnCancelListener(new DialogInterface.OnCancelListener() {
                        @Override
                        public void onCancel(DialogInterface dialog) {
                            disableTagWriteMode();
                            enableNdefExchangeMode();
                        }
                    }).create().show();
        }
    };
    

    private void setNoteBody(String body) {
        Editable text = mNoteRead.getText();
        text.clear();
        text.append(body);
    }

    private NdefMessage getNoteAsNdef() {
        byte[] textBytes = mNote.getText().toString().getBytes();
        NdefRecord textRecord = new NdefRecord(NdefRecord.TNF_MIME_MEDIA, "text/plain".getBytes(),
                new byte[] {}, textBytes);
        return new NdefMessage(new NdefRecord[] {
            textRecord
        });
    }

    NdefMessage[] getNdefMessages(Intent intent) {
        // Parse the intent
        NdefMessage[] msgs = null;
        String action = intent.getAction();
        if (NfcAdapter.ACTION_TAG_DISCOVERED.equals(action)
                || NfcAdapter.ACTION_NDEF_DISCOVERED.equals(action)) {
            Parcelable[] rawMsgs = intent.getParcelableArrayExtra(NfcAdapter.EXTRA_NDEF_MESSAGES);
            if (rawMsgs != null) {
                msgs = new NdefMessage[rawMsgs.length];
                for (int i = 0; i < rawMsgs.length; i++) {
                    msgs[i] = (NdefMessage) rawMsgs[i];
                }
            } else {
                // Unknown tag type
                byte[] empty = new byte[] {};
                NdefRecord record = new NdefRecord(NdefRecord.TNF_UNKNOWN, empty, empty, empty);
                NdefMessage msg = new NdefMessage(new NdefRecord[] {
                    record
                });
                msgs = new NdefMessage[] {
                    msg
                };
            }
        } else {
            Log.d(TAG, "Unknown intent.");
            finish();
        }
        return msgs;
    }

    private void enableNdefExchangeMode() {
        mNfcAdapter.enableForegroundNdefPush(MainActivity.this, getNoteAsNdef());
        mNfcAdapter.enableForegroundDispatch(this, mNfcPendingIntent, mNdefExchangeFilters, null);
    }

    private void disableNdefExchangeMode() {
        mNfcAdapter.disableForegroundNdefPush(this);
        mNfcAdapter.disableForegroundDispatch(this);
    }

    private void enableTagWriteMode() {
        mWriteMode = true;
        IntentFilter tagDetected = new IntentFilter(NfcAdapter.ACTION_TAG_DISCOVERED);
        mWriteTagFilters = new IntentFilter[] {
            tagDetected
        };
        mNfcAdapter.enableForegroundDispatch(this, mNfcPendingIntent, mWriteTagFilters, null);
    }

    private void disableTagWriteMode() {
        mWriteMode = false;
        mNfcAdapter.disableForegroundDispatch(this);
    }

    boolean writeTag(NdefMessage message, Tag tag) {
        int size = message.toByteArray().length;

        try {
            Ndef ndef = Ndef.get(tag);
            if (ndef != null) {
                ndef.connect();

                if (!ndef.isWritable()) {
                    toast("Tag is read-only.");
                    return false;
                }
                if (ndef.getMaxSize() < size) {
                    toast("Tag capacity is " + ndef.getMaxSize() + " bytes, message is " + size
                            + " bytes.");
                    return false;
                }

                ndef.writeNdefMessage(message);
                toast("写入数据成功.");
                return true;
            } else {
                NdefFormatable format = NdefFormatable.get(tag);
                if (format != null) {
                    try {
                        format.connect();
                        format.format(message);
                        toast("Formatted tag and wrote message");
                        return true;
                    } catch (IOException e) {
                        toast("Failed to format tag.");
                        return false;
                    }
                } else {
                    toast("Tag doesn't support NDEF.");
                    return false;
                }
            }
        } catch (Exception e) {
            toast("写入数据失败");
        }

        return false;
    }

    private void toast(String text) {
        Toast.makeText(this, text, Toast.LENGTH_SHORT).show();
    }}`

## 杨梅派连接 Ntf设备##

 [设备](http://item.taobao.com/item.htm?spm=a230r.1.14.21.FYLdwP&id=19307275283)
 未完待续
