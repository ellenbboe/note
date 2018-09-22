### frequency_analysis

In cryptanalysis, frequency analysis is the study of the frequency of letters or groups of letters in a ciphertext. The method is used as an **aid**(0.0) to breaking classical ciphers.

Frequency analysis is based on the fact that, in any given stretch(范围) of written language, certain letters and combinations of letters occur with varying frequencies. Moreover, there is a characteristic distribution of letters that is roughly the same for almost all samples of that language. For instance, given a section of English language, E, T, A and O are the most common, while Z, Q and X are rare. Likewise, TH, ER, ON, and AN are the most common pairs of letters (termed bigrams or digraphs), and SS, EE, TT, and FF are the most common repeats. The nonsense phrase "ETAOIN SHRDLU" represents the 12 most frequent letters in typical English language text.

In some ciphers, such properties of the natural language plaintext are preserved in the ciphertext, and these patterns have the potential to be exploited in a ciphertext-only attack.

代码区:

统计:
```
def start():
    filename=input("输入文件名称:")
    print("-----文件名: "+filename+"-------")
    with open(filename, 'r') as f:
        file = f.read()
    d={}
    for i in file:
        if(i.isalpha()):
            if(d.get(i) == None):
                d[i] = 0
            d[i] = d.get(i) + 1
    filename = filename+"_result"
    with open(filename,"w") as f:
        for k,v in d.items():
            string =str(v)+" "+k+"\n" #将values写在前面有助于sort(偷懒)
            f.write(string)
    return "done"
```
使用 `sort` 进行排序
`sort -n -r file`

可以参考频率表
频率分析网站 http://www.richkni.co.uk/php/crypta/freq.php
然后猜猜猜(划重点)
然而对于我来说是太难了 0.0
