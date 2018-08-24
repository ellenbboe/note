#### 一般提交操作为:
```
git add -all ==>  gaa
git commit -m "xxxx" ==> gc
git pull ==>   gl
git push  ==>  gp
```
#### 自动保存密码:
`git config --global credential.helper store`

#### git443错误
`OpenSSL SSL_connect: SSL_ERROR_SYSCALL in connection to github.com:443`

网上的解决方法都不管用

我的解决方法:重新clone到本地 进行上传 成功

#### git 上传脚本

由于上传命令太多了,所以写了脚本

```
#!/bin/bash
git add --all;git commit -m "$1";git pull;git push;
```
使用方法 `文件名 "comment"`


---------------------------------------------
## git 教程
### Introduction
Git is currently the most widely used version control system in the world, mostly thanks to GitHub.(感谢github) By that measure, I’d argue that it’s also the most misunderstood version control system in the world.

This statement probably doesn’t ring true straight away because on the surface, Git is pretty simple. It’s really easy to pick up if you’ve come from another VCS like Subversion or Mercurial. It’s even relatively easy to pick up if you’ve never used a VCS before. Everybody understands adding, committing, pushing and pulling; but this is about as far as Git’s simplicity goes. Past this point, Git is shrouded by fear, uncertainty and doubt.

Once you start talking about branching, merging, rebasing, multiple remotes, remote-tracking branches, detached HEAD states… Git becomes less of an easily-understood tool and more of a feared deity. Anybody who talks about no-fast-forward merges is regarded with quiet superstition, and even veteran hackers would rather stay away from rebasing “just to be safe”.

I think a big part of this is due to many people coming to Git from a conceptually simpler VCS – probably Subversion – and trying to apply their past knowledge to Git. It’s easy to understand why people want to do this. Subversion is simple, right? It’s just files and folders. Commits are numbered sequentially. Even branching and tagging is simple – it’s just like taking a backup of a folder.

Basically, Subversion fits in nicely with our existing computing paradigms. Everybody understands files and folders. Everybody knows that revision #10 was the one after #9 and before #11. But these paradigms break down when you try to apply them to Git.

That’s why trying to understand Git in this way is wrong. Git doesn’t work like Subversion at all. Which can be pretty confusing. You can add and remove files. You can commit your changes. You can generate diffs and patches which look just like the ones that Subversion generates. So how can something which appears so similar really be so different?

Complex systems like Git become much easier to understand once you figure out how they really work. The goal of this guide is to shed some light on how Git works under the hood. We’re going to take a look at some of Git’s core concepts including its basic object storage, how commits work, how branches and tags work, and we’ll look at the different kinds of merging in Git including the much-feared rebase. Hopefully at the end of it all, you’ll have a solid understanding of these concepts and will be able to use some of Git’s more advanced features with confidence.

It’s worth noting at this point that this guide is not intended to be a beginner’s introduction to Git. This guide was written for people who already use Git, but would like to better understand it by taking a peek under the hood, and learn a few neat tricks along the way. With that said, let’s begin.
### Repositories
At the core of Git, like other VCS, is the repository. A Git repository is really just a simple key-value data store. This is where Git stores, among other things:
**Blobs**, which are the most basic data type in Git. Essentially, a blob is just a bunch of bytes; usually a binary representation of a file.
**Tree objects**, which are a bit like directories. Tree objects can contain pointers to blobs and other tree objects.
**Commit objects**, which point to a single tree object, and contain some metadata including the commit author and any parent commits.
**Tag objects**, which point to a single commit object, and contain some metadata.
**References**, which are pointers to a single object (usually a commit or tag object).
You don’t need to worry about all of this just yet; we’ll cover these things in more detail later.

The important thing to remember about a Git repository is that it exists entirely in a single .git directory in your project root. There is no central repository like in Subversion or CVS. This is what allows Git to be a distributed version control system – everybody has their own self-contained version of a repository.

You can initialize a Git repository anywhere with the git init command. Take a look inside the .git folder to get a glimpse of what a repository looks like.
```
$ git init
Initialized empty Git repository in /home/demo/demo-repository/.git/
$ ls -l .git
total 32
drwxrwxr-x 2 demo demo 4096 May 24 20:10 branches
-rw-rw-r-- 1 demo demo 92 May 24 20:10 config
-rw-rw-r-- 1 demo demo 73 May 24 20:10 description
-rw-rw-r-- 1 demo demo 23 May 24 20:10 HEAD
drwxrwxr-x 2 demo demo 4096 May 24 20:10 hooks
drwxrwxr-x 2 demo demo 4096 May 24 20:10 info
drwxrwxr-x 4 demo demo 4096 May 24 20:10 objects
drwxrwxr-x 4 demo demo 4096 May 24 20:10 refs
```
The important directories are .git/objects, where Git stores all of its objects; and .git/refs, where Git stores all of its references(标记).

We’ll see how all of this fits together as we learn about the rest of Git. For now, let’s learn a little bit more about tree objects.

### Tree Objects
A tree object in Git can be thought of as a directory. It contains a list of blobs (**files**) and other tree objects (**sub-directories**).

Imagine we had a simple repository, with a README file and a src/ directory containing a hello.c file.
```
README
src/
    hello.c
```
This would be represented by two tree objects: one for the root directory, and another for the src/ directory. Here’s what they would look like.

**tree 4da454..**
blob|976165..	|README
tree|	81fc8b..|	src
**tree 81fc8b..**
blob|	1febef..|	hello.c

Notice how given the root tree object, we can recurse through every tree object to figure out the state of the entire working tree. The root tree object, therefore, is essentially a snapshot of your repository at a given time. Usually when Git refers to “the tree”, it is referring to the root tree object.

Now let’s learn how you can track the history of your repository with commit objects.

### Commits
A commit object is essentially a pointer that contains a few pieces of important metadata. The commit itself has a hash, which is built from a combination of the metadata that it contains:

The hash of the tree (the root tree object) at the time of the commit. As we learned in Tree Objects, this means that with a single commit, Git can build the entire working tree by recursing into the tree.
The hash of any parent commits. This is what gives a repository its history: every commit has a parent commit, all the way back to the very first commit.
The author’s name and email address, and the time that the changes were authored.
The committer’s name and email address, and the time that the commit was made.
The commit message.
Let’s see a commit object in action by creating a simple repository.
